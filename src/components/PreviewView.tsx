import type { DraftLine } from '../converter/parseDraft'

interface PreviewViewProps {
  lines: DraftLine[]
}

/** 変換結果を、見出しを色分けした記事の見た目で表示する */
export function PreviewView({ lines }: PreviewViewProps) {
  return (
    <div className="preview">
      {lines.map((line) => {
        switch (line.kind) {
          case 'h2':
            return (
              <div key={line.lineNumber} className="preview__h2">
                <span className="preview__tag">H2</span>
                {line.text}
              </div>
            )
          case 'h3':
            return (
              <div key={line.lineNumber} className="preview__h3">
                <span className="preview__tag">H3</span>
                {line.text}
              </div>
            )
          case 'blank':
            return <div key={line.lineNumber} className="preview__gap" />
          default:
            return (
              <p key={line.lineNumber} className="preview__body">
                {line.text}
              </p>
            )
        }
      })}
    </div>
  )
}
