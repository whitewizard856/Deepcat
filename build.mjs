// Build script: three independent bundles, no framework tax.
//
// main and preload run in Node/Electron, so `electron` stays external (it is provided by
// the runtime, not bundled). The renderer bundles React and its CSS into a single file so
// the window can load it with one request and no dev server in production.
import { cpSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const root = dirname(fileURLToPath(import.meta.url))
const watch = process.argv.includes('--watch')

/** @param {esbuild.BuildOptions} options */
async function bundle(options) {
  const context = await esbuild.context({
    bundle: true,
    // Off by default: a shipped build should not carry source maps or the absolute build
    // paths esbuild writes into its module comments.
    sourcemap: process.env.SOURCEMAP === '1',
    minifyWhitespace: true,
    legalComments: 'none',
    logLevel: 'info',
    ...options,
  })
  if (watch) await context.watch()
  else {
    await context.rebuild()
    await context.dispose()
  }
}

async function main() {
  mkdirSync(join(root, 'dist', 'renderer'), { recursive: true })

  // Relative entry points + absWorkingDir: esbuild stamps module keys with the path it was
  // given, and an absolute one would publish this machine's directory layout.
  await bundle({
    absWorkingDir: root,
    entryPoints: ['src/main/index.ts'],
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    external: ['electron'],
    outfile: 'dist/main/index.js',
  })

  await bundle({
    absWorkingDir: root,
    entryPoints: ['src/preload/index.ts'],
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    external: ['electron'],
    outfile: 'dist/preload/index.js',
  })

  await bundle({
    absWorkingDir: root,
    entryPoints: ['src/preload/webview.ts'],
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    external: ['electron'],
    outfile: 'dist/preload/webview.js',
  })

  await bundle({
    absWorkingDir: root,
    entryPoints: ['src/renderer/main.tsx'],
    platform: 'browser',
    format: 'iife',
    target: 'chrome120',
    jsx: 'automatic',
    outfile: 'dist/renderer/app.js',
  })

  cpSync(join(root, 'src', 'renderer', 'index.html'), join(root, 'dist', 'renderer', 'index.html'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
