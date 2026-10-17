import { app } from 'electron'
import { dirname, join } from 'node:path'

/**
 * Where the dsh kernel lives.
 *
 * Priority: `DSH_SHELL_KERNEL`, then the bundled copy next to the executable (`resources/
 * kernel` once packaged, `vendor/kernel` in a dev checkout). Bundling the kernel makes the
 * installer self-contained at the cost of ~540 MB the shell itself does not own.
 */
const DEFAULT_KERNEL_ROOT = app.isPackaged
  ? join(process.resourcesPath, 'kernel')
  : join(dirname(process.execPath), 'kernel')

export const KERNEL_ROOT = process.env.DSH_SHELL_KERNEL ?? DEFAULT_KERNEL_ROOT

export const KERNEL_BIN = join(KERNEL_ROOT, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js')

/** A Node build shipped beside the kernel; Electron's own Node is a different runtime. */
export const KERNEL_NODE = join(KERNEL_ROOT, 'node.exe')

export const HOST = '127.0.0.1'

/** Startup budget: a cold kernel with plugins takes tens of seconds. */
export const READY_TIMEOUT_MS = 120_000
