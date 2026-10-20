import type { DraftLine } from './parseDraft'

/**
 * 出力する行だけを残す。プレビューとHTMLの両方がこの並びを使う。
 *
 * - 区切りの行は出さない
 * - 連続する空行は1つにまとめ、先頭と末尾の空行は出さない
 */
export function buildOutputLines(lines: DraftLine[]): DraftLine[] {
  const output: DraftLine[] = []
  let pendingBlank: DraftLine | null = null

  for (const line of lines) {
    if (line.kind === 'delete') continue
    if (line.kind === 'blank') {
      if (output.length > 0) pendingBlank ??= line
      continue
    }
    if (pendingBlank) output.push(pendingBlank)
    pendingBlank = null
    output.push(line)
  }

  return output
}

/**
 * 1行をWordPress（クラシックエディタ）用のHTMLにする。
 * 見出しだけタグで囲み、本文はそのまま出す
 * （クラシックエディタが空行を段落に変換するため `<p>` はつけない）。
 */
export function renderLine(line: DraftLine): string {
  switch (line.kind) {
    case 'h2':
      return `<h2>${line.text}</h2>`
    case 'h3':
      return `<h3>${line.text}</h3>`
    default:
      return line.text
  }
}

/** 行の並びを、WordPress（クラシックエディタ）に貼り付けるHTMLにする */
export function toHtml(lines: DraftLine[]): string {
  return buildOutputLines(lines).map(renderLine).join('\n')
}
