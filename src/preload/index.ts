import { contextBridge, ipcRenderer } from 'electron'

export interface KernelState {
  status: 'starting' | 'ready' | 'failed' | 'stopped'
  port: number | null
  url: string | null
  error: string | null
  log: string[]
}

export interface AppInfo {
  version: string
  electron: string
  node: string
  platform: string
  kernelRoot: string
  webviewPreload: string
}

export interface SessionSummary {
  id: string
  title: string
  cwd: string
  updatedAt: number
  events: number
}

/**
 * The only surface the renderer gets. Everything is request/response or an explicit
 * subscription: no Node, no module loading, no arbitrary IPC from the page.
 */
const api = {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
    close: () => ipcRenderer.send('window:close'),
  },
  kernel: {
    snapshot: (): Promise<KernelState> => ipcRenderer.invoke('kernel:snapshot'),
    restart: (): Promise<KernelState> => ipcRenderer.invoke('kernel:restart'),
    home: (): Promise<string> => ipcRenderer.invoke('kernel:home'),
    subscribe: (listener: (state: KernelState) => void): (() => void) => {
      const handler = (_event: unknown, state: KernelState): void => listener(state)
      ipcRenderer.on('kernel:state', handler)
      return () => ipcRenderer.removeListener('kernel:state', handler)
    },
  },
  app: {
    info: (): Promise<AppInfo> => ipcRenderer.invoke('app:info'),
    reload: () => ipcRenderer.send('app:reload'),
    devtools: () => ipcRenderer.send('app:devtools'),
    loginItem: (): Promise<boolean> => ipcRenderer.invoke('app:login-item'),
    setLoginItem: (value: boolean): Promise<boolean> => ipcRenderer.invoke('app:login-item-set', value),
    openLogs: () => ipcRenderer.send('app:open-logs'),
    testNotification: () => ipcRenderer.send('app:test-notification'),
    notify: (title: string, body: string) => ipcRenderer.send('app:notify', { title, body }),
  },
  openExternal: (url: string) => ipcRenderer.send('shell:open-external', url),
  chrome: {
    onTogglePalette: (listener: () => void): (() => void) => {
      const handler = (): void => listener()
      ipcRenderer.on('chrome:toggle-palette', handler)
      return () => ipcRenderer.removeListener('chrome:toggle-palette', handler)
    },
    onToggleSettings: (listener: () => void): (() => void) => {
      const handler = (): void => listener()
      ipcRenderer.on('chrome:toggle-settings', handler)
      return () => ipcRenderer.removeListener('chrome:toggle-settings', handler)
    },
  },
  theme: {
    get: (): Promise<Appearance> => ipcRenderer.invoke('theme:get'),
    set: (value: Appearance): Promise<Appearance> => ipcRenderer.invoke('theme:set', value),
  },
  shortcuts: {
    get: (): Promise<Record<string, string>> => ipcRenderer.invoke('shortcuts:get'),
    set: (overrides: Record<string, string>): Promise<Record<string, string>> =>
      ipcRenderer.invoke('shortcuts:set', overrides),
  },
  sessions: {
    list: (): Promise<SessionSummary[]> => ipcRenderer.invoke('sessions:list'),
  },
  armor: {
    get: (): Promise<boolean> => ipcRenderer.invoke('armor:get'),
    set: (enabled: boolean): Promise<boolean> => ipcRenderer.invoke('armor:set', enabled),
  },
}

export type ThemeMode = 'system' | 'light' | 'dark'

export interface Appearance {
  mode: ThemeMode
  fontSize: number
}

contextBridge.exposeInMainWorld('dsh', api)

export type DshHost = typeof api
