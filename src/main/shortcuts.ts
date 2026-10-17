import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Command id → binding text (`Mod+K`). Empty string means "explicitly unbound". */
export type ShortcutOverrides = Record<string, string>

/**
 * User rebindings, kept separate from the command registry the way dsh keeps its accepted
 * shortcut configuration apart from the definitions: the registry owns defaults, this file
 * owns the delta, and a command that disappears upstream simply stops matching.
 */
export function readShortcuts(userData: string): ShortcutOverrides {
  try {
    const raw = JSON.parse(readFileSync(join(userData, 'shortcuts.json'), 'utf8')) as unknown
    if (typeof raw !== 'object' || raw === null) return {}
    const overrides: ShortcutOverrides = {}
    for (const [id, binding] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof binding === 'string') overrides[id] = binding
    }
    return overrides
  } catch {
    return {}
  }
}

export function writeShortcuts(userData: string, overrides: ShortcutOverrides): void {
  try {
    writeFileSync(join(userData, 'shortcuts.json'), JSON.stringify(overrides, null, 2), 'utf8')
  } catch {
    // Losing a rebinding is not worth failing the click.
  }
}
