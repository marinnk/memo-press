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
  onChange: (value: string) => void
}

/**
 * 下書きの入力欄。入力欄の裏に同じ折り返しで行を並べ、
 * 各行の横に行番号と判定ラベルを表示する。
 */
export function DraftEditor({ value, lines, onChange }: DraftEditorProps) {
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
