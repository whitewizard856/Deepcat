import { appendFileSync, mkdirSync, renameSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MAX_BYTES = 2 * 1024 * 1024
const KEEP = 2

export interface Logger {
  path: string
  write(line: string): void
}

/**
 * Append-only kernel log on disk.
 *
 * The in-memory ring is what the settings panel shows; this is what survives a crash. Both
 * exist on purpose: a log you can only read while the app is alive cannot explain why it
 * died. Rotation is size-based and synchronous because a crash mid-write matters more than
 * a few milliseconds of IO.
 */
export function createLogger(dir: string): Logger {
  const path = join(dir, 'kernel.log')
  mkdirSync(dir, { recursive: true })
  return {
    path,
    write(line: string): void {
      try {
        appendFileSync(path, `${new Date().toISOString()} ${line}\n`, 'utf8')
        if (statSync(path).size > MAX_BYTES) rotate(path)
      } catch {
        // Logging must never take the app down.
      }
    },
  }
}

function rotate(path: string): void {
  for (let index = KEEP - 1; index >= 1; index -= 1) {
    try {
      renameSync(`${path}.${String(index)}`, `${path}.${String(index + 1)}`)
    } catch {
      // Missing generation — fine.
    }
  }
  try {
    renameSync(path, `${path}.1`)
  } catch {
    // Locked by a reader; the next write tries again.
  }
}
