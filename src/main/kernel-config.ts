import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Appearance } from './theme'

/**
 * The shell's whole kernel-side configuration, as one patch file.
 *
 * 0.2 composes its plugin tree from ordered layers and applies a patch entry by *replacing*
 * that row's `config`, so every key a plugin needs has to be present here. The file is
 * regenerated on every launch: hand edits do not survive, which is the price of the shell
 * owning the two layers it depends on (palette and the persona prefix).
 */
export function writeKernelConfig(
  kernelHome: string,
  appearance: Appearance,
  personaPrefix: string | null,
  plugins: readonly string[] = [],
): void {
  const lines: string[] = [
    '# Written by Deepcat on every launch — edits to this file are replaced.',
    '- id: ui-theme',
    '  config:',
    `    preference: ${appearance.mode}`,
    `    fontSize: ${String(appearance.fontSize)}`,
  ]

  if (personaPrefix !== null && personaPrefix.trim() !== '') {
    lines.push(
      '- id: system-prompt',
      '  config:',
      '    includeHarnessIdentity: false',
      '    includeRuntimeContext: false',
      '    personaPrefix: |-',
    )
    for (const line of personaPrefix.split('\n')) {
      // A trailing space keeps empty lines inside the YAML block scalar.
      lines.push(line === '' ? '      ' : `      ${line}`)
    }
  }

  for (const name of plugins) {
    lines.push('- insert:', `    - id: '${name}'`, `      name: '${name}'`)
  }

  // dsh-purge defaults to autoUpdateOnStart:false already; stating it here means the
  // shipped build keeps that behaviour even if the plugin's own default ever changes.
  lines.push(
    '- id: dsh-purge',
    '  config:',
    '    autoUpdateOnStart: false',
  )

  try {
    mkdirSync(kernelHome, { recursive: true })
    writeFileSync(join(kernelHome, 'cordis.patch.yml'), `${lines.join('\n')}\n`, 'utf8')
  } catch {
    // The kernel home may not exist yet; the kernel then starts with defaults.
  }
}
