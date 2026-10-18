import { app, BrowserWindow, ipcMain, Menu, nativeTheme, Notification, shell } from 'electron'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { KERNEL_ROOT } from './config'
import { matchesInput, parseBinding } from '../shared/keys'
import { Kernel, type KernelState } from './kernel'
import { createTray, destroyTray } from './tray'
import { loadWindowState, saveWindowState } from './window-state'
import { readAppearance, writeAppearance, type Appearance } from './theme'
import { buildPersonaPrefix, readArmor, writeArmor } from './armor'
import { writeKernelConfig } from './kernel-config'
import { readShortcuts, writeShortcuts, type ShortcutOverrides } from './shortcuts'
import { createLogger, type Logger } from './log-file'
import { listSessions } from './sessions'

const kernel = new Kernel()
let mainWindow: BrowserWindow | null = null
/** Set once the user has asked to quit; until then closing the window only hides it. */
let isQuitting = false
/** Cached so `before-input-event` never touches the disk on a keystroke. */
let shortcutCache: ShortcutOverrides = {}
/** Disk log; created on ready because `getPath` needs a ready app. */
let logger: Logger | null = null
let lastStatus: KernelState['status'] | null = null

function notify(title: string, body: string): void {
  if (!Notification.isSupported()) return
  new Notification({
    title,
    body,
    icon: join(__dirname, '..', '..', 'assets', 'icon.ico'),
  }).show()
}

/** Resolved lazily: getPath is only meaningful once the app is ready. */
function kernelHome(): string {
  return join(app.getPath('userData'), 'kernel-home')
}

function promptsDir(): string {
  return join(__dirname, '..', '..', 'assets', 'prompts')
}

/** Plugins shipped with the shell and mounted through the kernel patch. */
const BUILTIN_PLUGINS = ['dsh-purge', 'meow-memory'] as const

let pluginsSynced = false

function bundledPluginsDir(): string {
  // Plugins ship beside the asar, not inside it: Electron's asar filesystem is read-only
  // and a recursive copy out of it fails with ENOENT.
  return app.isPackaged
    ? join(process.resourcesPath, 'plugins')
    : join(__dirname, '..', '..', 'assets', 'plugins')
}

/**
 * Copies the staged plugins into the profile's node_modules.
 *
 * The kernel creates `profiles/web` on its first launch, so this cannot run before the
 * first start — it runs on the first `ready` instead and the caller restarts the kernel
 * once. A name that is already present is left alone unless the bundled copy is newer:
 * that is how a shipped plugin fix reaches users who already ran an older build.
 *
 * @returns whether anything was added or upgraded (i.e. a restart is needed)
 */
function readPluginVersion(dir: string): string | undefined {
  try {
    const raw = readFileSync(join(dir, 'package.json'), 'utf8').replace(/^\uFEFF/, '')
    const version = (JSON.parse(raw) as { version?: unknown }).version
    return typeof version === 'string' && version.length > 0 ? version : undefined
  } catch {
    return undefined
  }
}

function isNewerVersion(candidate: string, installed: string): boolean {
  const parse = (value: string): number[] =>
    value.split(/[.+-]/).map((part) => {
      const parsed = Number.parseInt(part, 10)
      return Number.isFinite(parsed) ? parsed : 0
    })
  const a = parse(candidate)
  const b = parse(installed)
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const left = a[i] ?? 0
    const right = b[i] ?? 0
    if (left !== right) return left > right
  }
  return false
}

function syncBundledPlugins(): boolean {
  const source = bundledPluginsDir()
  if (!existsSync(source)) return false
  const profile = join(kernelHome(), 'profiles', 'web')
  if (!existsSync(join(profile, 'package.json'))) return false
  const dest = join(profile, 'node_modules')
  let added = false
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const bundled = join(source, entry.name)
    const target = join(dest, entry.name)
    if (existsSync(target)) {
      const next = readPluginVersion(bundled)
      const current = readPluginVersion(target)
      if (next === undefined || current === undefined || !isNewerVersion(next, current)) continue
      try {
        rmSync(target, { recursive: true, force: true })
        logger?.write(`[plugins] upgrading ${entry.name} ${current} -> ${next}`)
      } catch (error) {
        logger?.write(`[plugins] failed to replace ${entry.name}: ${String(error)}`)
        continue
      }
    }
    try {
      cpSync(bundled, target, { recursive: true })
      added = true
      logger?.write(`[plugins] installed ${entry.name}`)
    } catch (error) {
      logger?.write(`[plugins] failed to install ${entry.name}: ${String(error)}`)
    }
  }
  return added
}

/** Rewrites the kernel patch from the current appearance + armour switch. */
function refreshKernelConfig(): void {
  const userData = app.getPath('userData')
  const appearance = readAppearance(userData)
  const persona = readArmor(userData) ? buildPersonaPrefix(promptsDir()) : null
  writeKernelConfig(kernelHome(), appearance, persona, BUILTIN_PLUGINS)
}

function createWindow(): BrowserWindow {
  const saved = loadWindowState(app.getPath('userData'))
  const window = new BrowserWindow({
    width: saved.width,
    height: saved.height,
    ...(saved.x !== null && saved.y !== null ? { x: saved.x, y: saved.y } : {}),
    minWidth: 960,
    minHeight: 640,
    show: false,
    frame: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#151517' : '#ffffff',
    titleBarStyle: 'hidden',
    // Windows takes the taskbar icon from the window, and prefers a real .ico with
    // multiple sizes over a downscaled PNG.
    icon: join(__dirname, '..', '..', 'assets', 'icon.ico'),
    webPreferences: {
      preload: join(__dirname, '..', 'preload', 'index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
    },
  })

  window.once('ready-to-show', () => {
    if (saved.maximized) window.maximize()
    window.show()
  })
  window.on('close', (event) => {
    // Closing the frame parks the app in the tray: a turn that is still running should not
    // be killed by a window action. Quitting is explicit, from the tray or the menu-less
    // accelerator path.
    captureWindowState()
    if (isQuitting) return
    event.preventDefault()
    window.hide()
  })
  window.on('closed', () => {
    mainWindow = null
  })

  // The renderer owns the whole chrome; a native menu would sit above it in a second visual
  // language, so there is none.
  window.setMenuBarVisibility(false)

  void window.loadFile(join(__dirname, '..', 'renderer', 'index.html'))
  return window
}

function captureWindowState(): void {
  if (mainWindow === null || mainWindow.isDestroyed()) return
  const maximized = mainWindow.isMaximized()
  const bounds = maximized ? mainWindow.getNormalBounds() : mainWindow.getBounds()
  saveWindowState(app.getPath('userData'), {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    maximized,
  })
}

function broadcast(state: KernelState): void {
  if (logger !== null && state.status !== lastStatus) {
    lastStatus = state.status
    logger.write(
      `[kernel] status=${state.status} port=${state.port === null ? '-' : String(state.port)}` +
        (state.error === null ? '' : ` error=${state.error}`),
    )
    if (state.status === 'failed') notify('Deepcat：内核没能起来', state.error ?? '未知错误')
  }
  if (state.status === 'ready' && !pluginsSynced) {
    pluginsSynced = true
    if (syncBundledPlugins()) {
      logger?.write('[plugins] restarting kernel once to mount bundled plugins')
      void (async () => {
        await kernel.stop()
        await kernel.start({ home: kernelHome(), cwd: process.cwd() })
      })()
    }
  }
  if (mainWindow === null || mainWindow.isDestroyed()) return
  mainWindow.webContents.send('kernel:state', state)
}

function registerIpc(): void {
  ipcMain.handle('kernel:snapshot', () => kernel.state)

  // Chrome-level accelerators have to be caught at the webContents layer: once focus is
  // inside the <webview>, a keydown listener in our own renderer never sees the event.
  // The bindings come from the user's overrides so a rebind made in settings also works
  // while the caret is in the chat box.
  app.on('web-contents-created', (_event, contents) => {
    contents.on('before-input-event', (inputEvent, input) => {
      if (input.type !== 'keyDown') return
      const palette = parseBinding(shortcutCache['app.palette'] ?? 'Mod+K')
      const settings = parseBinding(shortcutCache['app.settings'] ?? 'Mod+,')
      if (palette !== null && matchesInput(input, palette)) {
        inputEvent.preventDefault()
        mainWindow?.webContents.send('chrome:toggle-palette')
        return
      }
      if (settings !== null && matchesInput(input, settings)) {
        inputEvent.preventDefault()
        mainWindow?.webContents.send('chrome:toggle-settings')
      }
    })
  })

  ipcMain.handle('kernel:restart', async () => {
    await kernel.stop()
    return kernel.start({ home: kernelHome(), cwd: process.cwd() })
  })

  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:toggle-maximize', () => {
    if (mainWindow === null) return
    if (mainWindow.isMaximized()) mainWindow.unmaximize()
    else mainWindow.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())

  ipcMain.handle('app:info', () => ({
    version: app.getVersion(),
    electron: process.versions.electron,
    node: process.versions.node,
    platform: process.platform,
    kernelRoot: KERNEL_ROOT,
    webviewPreload: pathToFileURL(join(__dirname, '..', 'preload', 'webview.js')).toString(),
  }))

  ipcMain.on('shell:open-external', (_event, url: string) => {
    if (typeof url === 'string' && /^https?:\/\//.test(url)) void shell.openExternal(url)
  })

  ipcMain.handle('shortcuts:get', () => readShortcuts(app.getPath('userData')))
  ipcMain.handle('shortcuts:set', (_event, overrides: ShortcutOverrides) => {
    writeShortcuts(app.getPath('userData'), overrides)
    shortcutCache = overrides
    return overrides
  })

  ipcMain.handle('app:login-item', () => app.getLoginItemSettings().openAtLogin)
  ipcMain.handle('app:login-item-set', (_event, value: boolean) => {
    app.setLoginItemSettings({ openAtLogin: value === true })
    return app.getLoginItemSettings().openAtLogin
  })

  ipcMain.on('app:reload', () => mainWindow?.webContents.reload())
  ipcMain.on('app:open-logs', () => {
    if (logger !== null) shell.showItemInFolder(logger.path)
  })
  ipcMain.on('app:test-notification', () => notify('Deepcat', '通知正常，任务跑完之后会这样提醒你。'))
  ipcMain.on('app:notify', (_event, payload: { title?: string; body?: string }) => {
    logger?.write(`[notify] ${payload.title ?? 'Deepcat'} — ${payload.body ?? ''}`)
    notify(payload.title ?? 'Deepcat', payload.body ?? '')
  })
  ipcMain.on('app:devtools', () => mainWindow?.webContents.toggleDevTools())
  ipcMain.handle('kernel:home', () => kernelHome())

  ipcMain.handle('sessions:list', () => listSessions(kernelHome()))

  ipcMain.handle('theme:get', () => readAppearance(app.getPath('userData')))
  ipcMain.handle('theme:set', (_event, value: Appearance) => {
    writeAppearance(app.getPath('userData'), value)
    refreshKernelConfig()
    return value
  })

  ipcMain.handle('armor:get', () => readArmor(app.getPath('userData')))
  ipcMain.handle('armor:set', (_event, enabled: boolean) => {
    writeArmor(app.getPath('userData'), enabled === true)
    refreshKernelConfig()
    return enabled === true
  })
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow === null) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })

  // No application menu at all: no File/Edit/View/Window strip, no hidden accelerators
  // competing with the ones the renderer defines.
  Menu.setApplicationMenu(null)

  app.whenReady().then(async () => {
    shortcutCache = readShortcuts(app.getPath('userData'))
    logger = createLogger(join(app.getPath('userData'), 'logs'))
    logger.write(`[app] Deepcat ${app.getVersion()} starting (electron ${process.versions.electron})`)
    kernel.setLogSink((line) => logger?.write(line))
    refreshKernelConfig()
    registerIpc()
    kernel.on('state', broadcast)
    mainWindow = createWindow()
    createTray({
      show: () => {
        if (mainWindow === null) return
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
      },
      restartKernel: () => {
        void (async () => {
          await kernel.stop()
          await kernel.start({ home: kernelHome(), cwd: process.cwd() })
        })()
      },
      openSettings: () => {
        if (mainWindow === null) return
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send('chrome:toggle-settings')
      },
    })

    mainWindow.webContents.once('did-finish-load', () => {
      broadcast(kernel.state)
      void kernel.start({ home: kernelHome(), cwd: process.cwd() })
    })
  })

  app.on('window-all-closed', () => {
    // Nothing to do: the tray keeps the app alive and the kernel running.
  })

  app.on('before-quit', () => {
    isQuitting = true
    captureWindowState()
    destroyTray()
    void kernel.stop()
  })
}
