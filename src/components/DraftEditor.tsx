import { useRef, type UIEvent } from 'react'
import type { DraftLine, LineKind } from '../converter/parseDraft'

const LINE_LABELS: Record<LineKind, string> = {
  h2: '見出し2',
  h3: '見出し3',
  delete: '削除',
  body: '本文',
  blank: '',
}

const PLACEHOLDER = [
  'ここにメモ帳の下書きを貼り付けてください。',
  '',
  '「。」「！」「？」で終わらない行 → 見出し2',
  '先頭に「h3 」をつけた行 → 見出し3',
].join('\n')

interface DraftEditorProps {
  value: string
  lines: DraftLine[]
  canUndoClear: boolean
  onChange: (value: string) => void
  onClear: () => void
  onUndoClear: () => void
}

/**
 * 下書きの入力欄。入力欄の裏に同じ折り返しで行を並べ、
 * 各行の横に行番号と判定ラベルを表示する。
 */
export function DraftEditor({ value, lines, canUndoClear, onChange, onClear, onUndoClear }: DraftEditorProps) {
  const linesRef = useRef<HTMLDivElement>(null)

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (linesRef.current) {
      linesRef.current.style.transform = `translateY(${-event.currentTarget.scrollTop}px)`
    }
  }

  return (
    <section className="panel" aria-labelledby="draft-heading">
      <div className="panel__header">
        <h2 id="draft-heading" className="panel__title">
          下書き
        </h2>
        <div aria-live="polite">
          {canUndoClear ? (
            <span className="undo-notice">
              削除しました
              <button type="button" className="button button--soft button--small" onClick={onUndoClear}>
                元に戻す
              </button>
            </span>
          ) : (
            value !== '' && (
              <button type="button" className="button button--outline button--small" onClick={onClear}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M6 6l1 14h10l1-14" />
                </svg>
                下書きを削除
              </button>
            )
          )}
        </div>
      </div>
      <div className="line-legend" aria-hidden="true">
        <span>行の判定：</span>
        <span className="line-label line-label--h2">見出し2</span>
        <span className="line-label line-label--h3">見出し3</span>
        <span className="line-label line-label--delete">削除</span>
        <span className="line-label line-label--body">本文</span>
      </div>
      <div className="draft-editor">
        <div className="draft-editor__backdrop" aria-hidden="true">
          <div ref={linesRef}>
            {lines.map((line) => (
              <div key={line.lineNumber} className={`draft-line draft-line--${line.kind}`}>
                <span className="draft-line__number">{line.lineNumber}</span>
                {line.kind === 'blank' ? (
                  <span />
                ) : (
                  <span className={`line-label line-label--${line.kind}`}>{LINE_LABELS[line.kind]}</span>
                )}
                <span className="draft-line__text">{line.raw}</span>
              </div>
            ))}
          </div>
        </div>
        <textarea
          className="draft-editor__input"
          aria-label="下書き"
          placeholder={PLACEHOLDER}
          spellCheck={false}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onScroll={syncScroll}
        />
      </div>
    </section>
  )
}
