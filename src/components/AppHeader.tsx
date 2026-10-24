import { formatSavedTime } from '../draft/format'
import type { SaveStatus } from '../hooks/useDraft'

interface AppHeaderProps {
  saveStatus: SaveStatus
  canExport: boolean
  onExport: () => void
}

function SaveStatusText({ status }: { status: SaveStatus }) {
  if (status.kind === 'idle') return null
  if (status.kind === 'failed') {
    return <span className="save-status save-status--failed">ブラウザに保存できませんでした</span>
  }
  return (
    <span className="save-status">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      ブラウザに自動保存済み（{formatSavedTime(new Date(status.savedAt))}）
    </span>
  )
}

export function AppHeader({ saveStatus, canExport, onExport }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1 className="app-header__title">memo-press</h1>
        <p className="app-header__tagline">メモ帳の下書き → WordPress（JIN／クラシックエディタ）</p>
      </div>
      <div className="app-header__actions">
        <div aria-live="polite">
          <SaveStatusText status={saveStatus} />
        </div>
        <button type="button" className="button button--outline" disabled={!canExport} onClick={onExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          テキストで書き出し
        </button>
      </div>
    </header>
  )
}
