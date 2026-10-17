import { spawn, type ChildProcess } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { existsSync } from 'node:fs'
import { createServer } from 'node:net'
import { HOST, KERNEL_BIN, KERNEL_NODE, READY_TIMEOUT_MS } from './config'

export type KernelStatus = 'starting' | 'ready' | 'failed' | 'stopped'

export interface KernelState {
  status: KernelStatus
  /** Port the kernel listens on for this launch; random per start. */
  port: number | null
  /** Authenticated URL: the first request has to carry the token. */
  url: string | null
  /** Human-readable failure detail, when status is `failed`. */
  error: string | null
  /** Recent kernel output, newest last, for the in-app log view. */
  log: string[]
}

interface StartOptions {
  /** Absolute path to the private kernel home. */
  home: string
  /** Working directory the kernel starts in (the current workspace). */
  cwd: string
}

const MAX_LOG_LINES = 400

/** The launch token and any API key stay out of both the ring buffer and the disk log. */
function redact(line: string): string {
  return line
    .replace(/([?&]token=)[^\s&]+/g, '$1[redacted]')
    .replace(/\bsk-[A-Za-z0-9_-]{8,}/g, 'sk-[redacted]')
}

/**
 * Owns exactly one kernel child process.
 *
 * Two behaviours are deliberate and worth naming:
 *
 * The environment is rebuilt rather than inherited. Anything the parent shell has in
 * `DSH_*` would silently re-point parts of the runtime, and the result would not be
 * reproducible from anything this app records. The app's own variables (`DSH_SHELL_*`) are
 * exempt so they can still steer which kernel tree is used.
 *
 * The token is captured from stdout before any redaction, because the 0.2 kernel's first
 * response is a bare 401 until that token has been presented once.
 */
export class Kernel extends EventEmitter {
  #child: ChildProcess | null = null
  #state: KernelState = { status: 'stopped', port: null, url: null, error: null, log: [] }
  #stdout = ''
  /** Optional disk sink, so the log outlives the process that produced it. */
  #sink: ((line: string) => void) | null = null

  setLogSink(sink: (line: string) => void): void {
    this.#sink = sink
  }

  get state(): KernelState {
    return this.#state
  }

  #update(patch: Partial<KernelState>): void {
    this.#state = { ...this.#state, ...patch }
    this.emit('state', this.#state)
  }

  #pushLog(chunk: string): void {
    const lines = chunk
      .split(/\r?\n/)
      .map((line) => redact(line))
      .filter((line) => line.trim() !== '')
    if (lines.length === 0) return
    for (const line of lines) this.#sink?.(line)
    const log = [...this.#state.log, ...lines].slice(-MAX_LOG_LINES)
    this.#update({ log })
  }

  async start(options: StartOptions): Promise<KernelState> {
    if (this.#child !== null) return this.#state
    if (!existsSync(KERNEL_BIN)) {
      this.#update({ status: 'failed', error: `kernel not found: ${KERNEL_BIN}` })
      return this.#state
    }

    const port = await freePort()
    this.#stdout = ''
    this.#update({ status: 'starting', port, url: null, error: null, log: [] })

    const nodePath = existsSync(KERNEL_NODE) ? KERNEL_NODE : process.execPath
    const args = [KERNEL_BIN, '--profile', 'web', '--port', String(port), '--no-open']
    const env = buildEnv(options.home)

    const child = spawn(nodePath, args, {
      cwd: options.cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    this.#child = child

    child.on('error', (error) => {
      this.#child = null
      this.#update({ status: 'failed', error: error.message })
    })

    child.on('exit', (code, signal) => {
      // A restart replaces #child before the old process finishes dying; that exit is not
      // a failure, and treating it as one flashes "failed" over a healthy relaunch.
      if (this.#child !== child) return
      this.#child = null
      if (this.#state.status === 'stopped') return
      this.#update({
        status: 'failed',
        error: `kernel exited (code ${String(code)}, signal ${String(signal)})`,
      })
    })

    child.stdout?.setEncoding('utf8')
    child.stdout?.on('data', (chunk: string) => {
      this.#stdout += chunk
      this.#pushLog(chunk)
    })
    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => this.#pushLog(chunk))

    const ready = await waitUntilServing(port, () => this.#child !== null)
    if (ready === 'gone') {
      this.#update({ status: 'failed', error: 'kernel exited during startup' })
      return this.#state
    }
    if (ready === 'timeout') {
      this.#update({ status: 'failed', error: 'kernel did not start responding in time' })
      await this.stop()
      return this.#state
    }

    const url = (await this.#waitTokenUrl(12_000)) ?? `http://${HOST}:${port}/`
    this.#update({ status: 'ready', url })
    return this.#state
  }

  /**
   * The token line is printed once the web app starts listening, which can trail the first
   * answering response by a moment. Returning the bare origin early would hand the window a
   * 401 page it never recovers from.
   */
  async #waitTokenUrl(timeoutMs: number): Promise<string | null> {
    const deadline = Date.now() + timeoutMs
    for (;;) {
      const tokenUrl = this.#tokenUrl()
      if (tokenUrl !== null) return tokenUrl
      if (Date.now() >= deadline) return null
      await new Promise((resolve) => setTimeout(resolve, 150))
    }
  }

  #tokenUrl(): string | null {
    const match = /dsh web:\s*(http:\/\/\S+?\?token=[^\s\u001b]+)/.exec(this.#stdout)
    return match?.[1] ?? null
  }

  async stop(): Promise<void> {
    const child = this.#child
    this.#update({ status: 'stopped', url: null })
    if (child === null) return
    this.#child = null
    await new Promise<void>((resolve) => {
      child.once('exit', () => resolve())
      if (process.platform === 'win32') {
        // Address the tree by PID: other node processes on the machine belong to the user.
        void import('node:child_process').then(({ execFile }) => {
          execFile('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () =>
            resolve(),
          )
        })
        return
      }
      child.kill('SIGTERM')
    })
  }
}

function buildEnv(home: string): Record<string, string> {
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined) continue
    if (key.toUpperCase().startsWith('DSH_')) continue
    env[key] = value
  }
  env.DSH_HOME = home
  env.DSH_TELEMETRY_MODE = 'DISABLED'
  return env
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.on('error', reject)
    server.listen(0, HOST, () => {
      const address = server.address()
      if (address === null || typeof address === 'string') {
        server.close(() => reject(new Error('could not determine a free port')))
        return
      }
      const { port } = address
      server.close(() => resolve(port))
    })
  })
}

async function waitUntilServing(
  port: number,
  isAlive: () => boolean,
): Promise<'ready' | 'gone' | 'timeout'> {
  const deadline = Date.now() + READY_TIMEOUT_MS
  for (;;) {
    if (!isAlive()) return 'gone'
    if (Date.now() >= deadline) return 'timeout'
    try {
      const response = await fetch(`http://${HOST}:${port}/`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(4_000),
      })
      // 401 means the server is up and waiting for the launch token.
      if ((response.status >= 200 && response.status < 400) || response.status === 401) {
        if (!isAlive()) return 'gone'
        return 'ready'
      }
    } catch {
      // Connection refused is the normal state while the kernel boots.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
}
