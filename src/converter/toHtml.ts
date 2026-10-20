import type { DraftLine } from './parseDraft'

/**
 * 行の並びを、WordPress（クラシックエディタ）に貼り付けるHTMLにする。
 *
 * - 見出しだけタグで囲み、本文はそのまま出す
 *   （クラシックエディタが空行を段落に変換するため `<p>` はつけない）
 * - 区切りの行は出さない
 * - 連続する空行は1つにまとめ、先頭と末尾の空行は出さない
 */
export function toHtml(lines: DraftLine[]): string {
  const output: string[] = []
  let pendingBlank = false

  for (const line of lines) {
    if (line.kind === 'delete') continue
    if (line.kind === 'blank') {
      pendingBlank = output.length > 0
      continue
    }
    if (pendingBlank) output.push('')
    pendingBlank = false
    output.push(renderLine(line))
  }

  return output.join('\n')
}

function renderLine(line: DraftLine): string {
  switch (line.kind) {
    case 'h2':
      return `<h2>${line.text}</h2>`
    case 'h3':
      return `<h3>${line.text}</h3>`
    default:
      return line.text
  }
}
