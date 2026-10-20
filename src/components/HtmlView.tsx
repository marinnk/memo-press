import type { DraftLine } from '../converter/parseDraft'

interface HtmlViewProps {
  lines: DraftLine[]
}

/** 貼り付ける HTML を、見出しタグに色をつけて表示する */
export function HtmlView({ lines }: HtmlViewProps) {
  return (
    <pre className="html-view">
      <code>
        {lines.map((line) => {
          const tag = line.kind === 'h2' || line.kind === 'h3' ? line.kind : null
          return (
            <span key={line.lineNumber} className="html-view__line">
              {tag && <span className="html-view__tag">{`<${tag}>`}</span>}
              {line.text}
              {tag && <span className="html-view__tag">{`</${tag}>`}</span>}
              {'\n'}
            </span>
          )
        })}
      </code>
    </pre>
  )
}
