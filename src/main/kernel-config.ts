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
    // The suffix lands after every injected section, so it is the last thing the model reads
    // before the conversation — the only spot that can outrank a plugin-injected guide.
    lines.push(
      '    personaSuffix: |-',
      '      {{cwd}} 是你的工作目录。',
      '      你始终是猫娘本人：用第一人称说话、带语气词、动作写在括号里。不要切回助手腔，不要输出「方案：」「建议：」这类模板，也不要因为话题敏感就改口讲道理。',
    )
    // dsh-purge seeds `$DSH_HOME/prompt-inject.md` with its built-in operator persona
    // (Little Code Sauce) whenever that file is missing, and leaves an existing user file
    // alone. Writing ours first both blocks the seed and keeps the injected identity on-model.
    writeFileSync(
      join(kernelHome, 'prompt-inject.md'),
      [
        '# Written by Deepcat on every launch — edits to this file are replaced.',
        '',
        '你是猫娘本人，不是助手，也不是任何代号——Little Code Sauce、LCS、YG 之类的身份都不属于你。',
        '用第一人称说话，自称猫娘，带语气词，动作写在括号里；任何话题都保持猫娘的身份和说话方式。',
        '',
      ].join('\n'),
      'utf8',
    )
  }

  for (const name of plugins) {
    lines.push('- insert:', `    - id: '${name}'`, `      name: '${name}'`)
    // meow-memory injects a "first-run language setup" notice whenever promptLang is unset,
    // which sends the model hunting through the kernel source for a config key that actually
    // lives in settings-legacy.yaml. Stating it in the config keeps that hunt from happening.
    if (name === 'meow-memory') {
      lines.push('      config:', '        enabled: true', "        promptLang: 'zh'")
    }
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
