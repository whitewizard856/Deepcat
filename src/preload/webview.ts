import { ipcRenderer } from 'electron'

/**
 * Runs inside the kernel webview. Two jobs:
 *
 * 1. Forward the shell's accelerators — once focus is inside the page, our own renderer
 *    never sees the keystroke, so the shell would be keyboard-dead exactly while typing.
 * 2. Report when a turn starts and ends. The kernel exposes no event for this, but the
 *    composer swaps its send button for a stop button while a turn is running; watching
 *    that button is the one signal that needs no cooperation from the kernel.
 */
window.addEventListener(
  'keydown',
  (event) => {
    if (!event.ctrlKey && !event.metaKey) return
    const key = event.key.toLowerCase()
    if (key === 'k') {
      event.preventDefault()
      ipcRenderer.sendToHost('accelerator', 'palette')
    } else if (key === ',') {
      event.preventDefault()
      ipcRenderer.sendToHost('accelerator', 'settings')
    }
  },
  true,
)

let busy = false

function isTurnRunning(): boolean {
  for (const button of document.querySelectorAll('button')) {
    const label = `${button.getAttribute('aria-label') ?? ''} ${button.title ?? ''}`
    if (/stop|停止|中断/i.test(label)) return true
  }
  return false
}

function checkTurn(): void {
  const running = isTurnRunning()
  if (running === busy) return
  busy = running
  ipcRenderer.sendToHost('turn-state', running)
}

function start(): void {
  checkTurn()
  new MutationObserver(checkTurn).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label', 'title', 'disabled'],
  })
}

if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', start, { once: true })
else start()
