import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { zstdDecompressSync } from 'node:zlib'

export interface SessionSummary {
  id: string
  title: string
  cwd: string
  updatedAt: number
  events: number
}

const MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd])
const MAX_FILE_BYTES = 8 * 1024 * 1024

/**
 * dsh journals are multi-frame zstd: one frame per append, not one stream. A plain
 * `zstdDecompressSync` therefore returns only the first frame — which decodes to a single
 * `session` line and hides every later event, including the title.
 */
function decodeFrames(buffer: Buffer): string {
  let output = ''
  let offset = 0
  while (offset < buffer.length) {
    const start = buffer.indexOf(MAGIC, offset)
    if (start < 0) break
    const next = buffer.indexOf(MAGIC, start + 4)
    const frame = buffer.subarray(start, next < 0 ? buffer.length : next)
    try {
      output += zstdDecompressSync(frame).toString('utf8')
    } catch {
      // Truncated tail after a crash; the frames before it still count.
    }
    offset = next < 0 ? buffer.length : next
  }
  return output
}

function summarise(file: string, fallbackId: string): SessionSummary | null {
  const stat = statSync(file)
  if (stat.size > MAX_FILE_BYTES) return null
  const text = decodeFrames(readFileSync(file))

  let id = fallbackId
  let cwd = ''
  let title = ''
  let updatedAt = stat.mtimeMs
  let events = 0

  for (const line of text.split('\n')) {
    if (line.trim() === '') continue
    events += 1
    try {
      const event = JSON.parse(line) as {
        type?: string
        id?: string
        cwd?: string
        time?: number
        data?: { title?: unknown }
      }
      if (event.type === 'session') {
        if (typeof event.id === 'string') id = event.id
        if (typeof event.cwd === 'string') cwd = event.cwd
      }
      if (event.type === 'session/title' && typeof event.data?.title === 'string') {
        title = event.data.title
      }
      if (typeof event.time === 'number') updatedAt = Math.max(updatedAt, event.time)
    } catch {
      // A partial line from an interrupted write.
    }
  }

  return { id, title: title === '' ? '未命名会话' : title, cwd, updatedAt, events }
}

export function listSessions(home: string, limit = 10): SessionSummary[] {
  const root = join(home, 'sessions')
  let workspaces: string[]
  try {
    workspaces = readdirSync(root)
  } catch {
    return []
  }

  const sessions: SessionSummary[] = []
  for (const workspace of workspaces) {
    const dir = join(root, workspace)
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      continue
    }
    for (const entry of entries) {
      try {
        const summary = summarise(join(dir, entry, 'session.v4.jsonl.zstd'), entry)
        if (summary !== null) sessions.push(summary)
      } catch {
        // No journal in this directory.
      }
    }
  }

  sessions.sort((a, b) => b.updatedAt - a.updatedAt)
  return sessions.slice(0, limit)
}
