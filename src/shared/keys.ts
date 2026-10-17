/**
 * Binding parser and matcher shared by the main process (which sees keystrokes before the
 * page does) and the renderer (which owns the command registry). Same grammar in both
 * places, so a rebind can never mean two different things.
 */

export interface Gesture {
  mod: boolean
  shift: boolean
  alt: boolean
  key: string
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  escape: 'escape',
  space: ' ',
  plus: '+',
}

export function parseBinding(text: string): Gesture | null {
  const parts = text
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part !== '')
  if (parts.length === 0) return null

  const gesture: Gesture = { mod: false, shift: false, alt: false, key: '' }
  for (const part of parts) {
    if (part === 'mod' || part === 'ctrl' || part === 'cmd' || part === 'meta') gesture.mod = true
    else if (part === 'shift') gesture.shift = true
    else if (part === 'alt' || part === 'option') gesture.alt = true
    else gesture.key = KEY_ALIASES[part] ?? part
  }
  return gesture.key === '' ? null : gesture
}

export function matchesGesture(event: KeyboardEvent, gesture: Gesture): boolean {
  const mod = event.ctrlKey || event.metaKey
  if (mod !== gesture.mod) return false
  if (event.shiftKey !== gesture.shift) return false
  if (event.altKey !== gesture.alt) return false
  return event.key.toLowerCase() === gesture.key
}

/** Renders a binding for display: `Mod+K` becomes `Ctrl K`, `Mod+,` becomes `Ctrl ,`. */
export function formatBinding(text: string): string[] {
  const gesture = parseBinding(text)
  if (gesture === null) return []
  const keys: string[] = []
  if (gesture.mod) keys.push('Ctrl')
  if (gesture.alt) keys.push('Alt')
  if (gesture.shift) keys.push('Shift')
  keys.push(gesture.key === 'escape' ? 'Esc' : gesture.key.toUpperCase())
  return keys
}

/** Turns a keydown into binding text, or null while only modifiers are held. */
export function bindingFromEvent(event: KeyboardEvent): string | null {
  const key = event.key
  if (key === 'Control' || key === 'Meta' || key === 'Alt' || key === 'Shift') return null
  const parts: string[] = []
  if (event.ctrlKey || event.metaKey) parts.push('Mod')
  if (event.altKey) parts.push('Alt')
  if (event.shiftKey) parts.push('Shift')
  parts.push(key.length === 1 ? key.toUpperCase() : key)
  return parts.join('+')
}

/** The main process sees Electron's Input shape rather than a DOM event. */
export interface KeyInput {
  control: boolean
  meta: boolean
  shift: boolean
  alt: boolean
  key: string
}

export function matchesInput(input: KeyInput, gesture: Gesture): boolean {
  const mod = input.control || input.meta
  if (mod !== gesture.mod) return false
  if (input.shift !== gesture.shift) return false
  if (input.alt !== gesture.alt) return false
  return input.key.toLowerCase() === gesture.key
}
