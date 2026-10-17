import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Last line of defence for the shell's own tree.
 *
 * An uncaught error anywhere below used to blank the whole window with no way back — the
 * webview, the title bar and the settings all disappear at once. This keeps a readable
 * failure on screen and offers the two actions that actually help: reload, and open the
 * log folder.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('shell crashed', error, info.componentStack)
    try {
      window.dsh.app.openLogs()
    } catch {
      // Nothing else to do if even that fails.
    }
  }

  override render(): ReactNode {
    if (this.state.error === null) return this.props.children
    return (
      <div className="crash">
        <div className="crash-inner">
          <div className="crash-mark" />
          <h1 className="crash-title">壳这边出了点问题</h1>
          <p className="crash-sub">{this.state.error.message}</p>
          <button className="action" onClick={() => window.dsh.app.reload()}>
            重新加载
          </button>
          <button className="ghost" onClick={() => window.dsh.app.openLogs()}>
            打开日志文件夹
          </button>
        </div>
      </div>
    )
  }
}
