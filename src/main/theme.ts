import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export type ThemeMode = 'system' | 'light' | 'dark'

export interface Appearance {
  mode: ThemeMode
  /** Conversation body size in px; the kernel accepts 10–22. */
  fontSize: number
}

const MODES: readonly ThemeMode[] = ['system', 'light', 'dark']
const FONT_MIN = 10
const FONT_MAX = 22
const DEFAULT: Appearance = { mode: 'system', fontSize: 14 }

function normalize(value: unknown): Appearance {
  const raw = (value ?? {}) as Partial<Appearance>
  return {
    mode: MODES.includes(raw.mode as ThemeMode) ? (raw.mode as ThemeMode) : DEFAULT.mode,
    fontSize:
      typeof raw.fontSize === 'number' && Number.isFinite(raw.fontSize)
        ? Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(raw.fontSize)))
        : DEFAULT.fontSize,
  }
}

/**
 * The shell's appearance choice.
 *
 * It lives in two places on purpose: `theme.json` is ours to read at startup, and the
 * kernel's `cordis.patch.yml` is what makes the content area agree after a restart. The
 * live switch does not need the kernel at all — the UI's palette is driven by a body
 * attribute and the font size by a CSS variable, so the shell sets those directly and only
 * persists here.
 */
export function readAppearance(userData: string): Appearance {
  try {
    return normalize(JSON.parse(readFileSync(join(userData, 'theme.json'), 'utf8')))
  } catch {
    return { ...DEFAULT }
  }
}

export function writeAppearance(userData: string, value: Appearance): void {
  const appearance = normalize(value)
  try {
    writeFileSync(join(userData, 'theme.json'), JSON.stringify(appearance), 'utf8')
  } catch {
    // A lost preference is not worth failing a click over.
  }
}
