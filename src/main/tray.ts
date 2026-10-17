import { app, Menu, nativeImage, Tray } from 'electron'
import { join } from 'node:path'

let tray: Tray | null = null

interface TrayHandlers {
  show: () => void
  restartKernel: () => void
  openSettings: () => void
}

/**
 * A tray icon that survives window close is the difference between "an app I keep open"
 * and "a program I have to relaunch". Quitting is explicit; closing the window does not
 * silently kill a kernel that may be mid-turn.
 */
export function createTray(handlers: TrayHandlers): void {
  if (tray !== null) return
  const icon = nativeImage.createFromPath(join(__dirname, '..', '..', 'assets', 'tray.png'))
  tray = new Tray(icon)
  tray.setToolTip('Deepcat')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: '显示窗口', click: handlers.show },
      { label: '设置', click: handlers.openSettings },
      { label: '重启内核', click: handlers.restartKernel },
      { type: 'separator' },
      { label: '退出', click: () => app.quit() },
    ]),
  )
  tray.on('click', handlers.show)
}

export function destroyTray(): void {
  tray?.destroy()
  tray = null
}
