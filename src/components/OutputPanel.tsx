import { useState } from 'react'
import type { DraftLine } from '../converter/parseDraft'
import { useClipboard, type CopyStatus } from '../hooks/useClipboard'
import { HtmlView } from './HtmlView'
import { PreviewView } from './PreviewView'

type Tab = 'preview' | 'html'

const TABS: { id: Tab; label: string }[] = [
  { id: 'preview', label: 'プレビュー' },
  { id: 'html', label: 'HTML' },
]

const COPY_LABELS: Record<CopyStatus, string> = {
  idle: 'HTMLをコピー',
  copied: 'コピーしました',
  failed: 'コピーできませんでした',
}

interface OutputPanelProps {
  lines: DraftLine[]
  html: string
}

/** 変換結果をプレビューとHTMLのタブで切り替えて表示し、HTMLをコピーできるようにする */
export function OutputPanel({ lines, html }: OutputPanelProps) {
  const [tab, setTab] = useState<Tab>('preview')
  const { status, copy } = useClipboard()
  const isEmpty = lines.length === 0

  return (
    <section className="panel" aria-labelledby="output-heading">
      <h2 id="output-heading" className="visually-hidden">
        変換結果
      </h2>
      <div className="panel__header panel__header--tabs">
        <div className="tabs" role="tablist" aria-label="変換結果の表示">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls="output-tabpanel"
              className="tabs__tab"
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`button button--primary${status === 'copied' ? ' button--success' : ''}`}
          disabled={isEmpty}
          onClick={() => copy(html)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          <span aria-live="polite">{COPY_LABELS[status]}</span>
        </button>
      </div>
      <div id="output-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="panel__body">
        {isEmpty ? (
          <p className="empty-message">下書きを貼り付けると、ここに変換結果が表示されます。</p>
        ) : tab === 'preview' ? (
          <PreviewView lines={lines} />
        ) : (
          <HtmlView lines={lines} />
        )}
      </div>
    </section>
  )
}
