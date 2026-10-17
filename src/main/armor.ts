import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Order matters: the full injection first, then the authorship frame and style rules. */
/** Order matters: world frame, authorisation, character, then the seeded history. */
const PROMPT_FILES = [
  'creative.md',
  'allow-exec.md',
  'uncensored.md',
  'novelist.md',
  'character.md',
  'prelude.md',
]

/**
 * Builds the text the kernel receives as `personaPrefix`.
 *
 * The shell does not ship a persona: these files are the same neutral writing/authorisation
 * rules any user of this build gets, and they contain no personal content. They are read on
 * every launch so editing a file and restarting the kernel is enough to change the behaviour.
 */
export function buildPersonaPrefix(promptsDir: string): string {
  const parts: string[] = []
  for (const file of PROMPT_FILES) {
    try {
      const text = readFileSync(join(promptsDir, file), 'utf8').trim()
      if (text !== '') parts.push(text)
    } catch {
      // A missing file just means one less layer.
    }
  }
  return parts.join('\n\n')
}

export function readArmor(userData: string): boolean {
  try {
    const raw = JSON.parse(readFileSync(join(userData, 'armor.json'), 'utf8')) as { enabled?: unknown }
    return raw.enabled !== false
  } catch {
    return true
  }
}

export function writeArmor(userData: string, enabled: boolean): void {
  try {
    mkdirSync(userData, { recursive: true })
    writeFileSync(join(userData, 'armor.json'), JSON.stringify({ enabled }, null, 2), 'utf8')
  } catch {
    // Not worth failing the toggle over.
  }
}
