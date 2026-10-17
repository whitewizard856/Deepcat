import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export interface WindowState {
  width: number
  height: number
  x: number | null
  y: number | null
  maximized: boolean
}

const DEFAULTS: WindowState = { width: 1320, height: 880, x: null, y: null, maximized: false }

export function loadWindowState(userData: string): WindowState {
  try {
    const raw = JSON.parse(readFileSync(join(userData, 'window-state.json'), 'utf8')) as Partial<WindowState>
    return {
      width: clampInt(raw.width, 640, 10000) ?? DEFAULTS.width,
      height: clampInt(raw.height, 480, 10000) ?? DEFAULTS.height,
      x: clampInt(raw.x, -10000, 10000) ?? null,
      y: clampInt(raw.y, -10000, 10000) ?? null,
      maximized: raw.maximized === true,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveWindowState(userData: string, state: WindowState): void {
  try {
    writeFileSync(join(userData, 'window-state.json'), JSON.stringify(state), 'utf8')
  } catch {
    // A lost window position is not worth failing a quit over.
  }
}

function clampInt(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  const rounded = Math.round(value)
  if (rounded < min || rounded > max) return null
  return rounded
}
