/**
 * Command registry, modelled on dsh's own `dsh-client-ui-commands` + `ShortcutRegistry`:
 * features register commands, the shell owns the palette and the key routing, and a
 * command carries enough metadata to be listed, grouped, searched and bound without the
 * caller knowing anything about the UI.
 */

export interface Command {
  /** Stable identity, also the dispatch key. */
  id: string
  /** Human label shown in the palette. */
  title: string
  /** Group heading; equal names share a section, first appearance wins the order. */
  group: string
  /** Extra search terms that are not part of the visible label. */
  keywords?: string[]
  /** Optional binding, e.g. `Mod+K`, `Mod+,`, `Escape`. */
  binding?: string
  run: () => void | Promise<void>
}

export interface CommandSection {
  group: string
  items: Command[]
}

export class CommandRegistry {
  readonly #commands = new Map<string, Command>()

  register(command: Command): () => void {
    this.#commands.set(command.id, command)
    return () => this.#commands.delete(command.id)
  }

  list(): Command[] {
    return [...this.#commands.values()]
  }

  /**
   * Substring match on the label plus subsequence match on the keywords, ranked so that a
   * label hit always outranks a keyword hit. Ported from the two search modes dsh exposes
   * (`substring` and `fuzzy-label`), collapsed into one because a palette has room for both.
   */
  search(query: string): Command[] {
    const needle = query.trim().toLowerCase()
    if (needle === '') return this.list()

    const scored: { command: Command; score: number }[] = []
    for (const command of this.#commands.values()) {
      const title = command.title.toLowerCase()
      if (title.includes(needle)) {
        scored.push({ command, score: 1000 - title.indexOf(needle) })
        continue
      }
      const haystack = [title, ...(command.keywords ?? []).map((word) => word.toLowerCase())]
      const fuzzy = haystack.reduce((best, text) => Math.max(best, subsequenceScore(text, needle)), 0)
      if (fuzzy > 0) scored.push({ command, score: fuzzy })
    }
    scored.sort((a, b) => b.score - a.score)
    return scored.map((entry) => entry.command)
  }

  /** Groups keeping first-appearance order, the way dsh's popup keeps its headings. */
  grouped(commands: Command[]): CommandSection[] {
    const sections: CommandSection[] = []
    const index = new Map<string, CommandSection>()
    for (const command of commands) {
      let section = index.get(command.group)
      if (section === undefined) {
        section = { group: command.group, items: [] }
        index.set(command.group, section)
        sections.push(section)
      }
      section.items.push(command)
    }
    return sections
  }

  findByBinding(binding: string): Command | undefined {
    const target = binding.toLowerCase()
    for (const command of this.#commands.values()) {
      if (command.binding !== undefined && command.binding.toLowerCase() === target) return command
    }
    return undefined
  }
}

/** Returns 0 for no match, otherwise a score that rewards longer contiguous runs. */
function subsequenceScore(text: string, needle: string): number {
  let cursor = 0
  let score = 0
  let run = 0
  for (const char of needle) {
    const found = text.indexOf(char, cursor)
    if (found === -1) return 0
    run = found === cursor ? run + 1 : 0
    score += 10 + run * 5
    cursor = found + 1
  }
  return score
}
