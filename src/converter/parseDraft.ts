/**
 * 下書きの1行の種類。
 * - h2: 「。」で終わらない行
 * - h3: 先頭に `h3` をつけた行
 * - delete: 構成メモ用の区切り（出力しない）
 * - body: それ以外の本文
 * - blank: 空行（空白だけの行を含む）
 */
export type LineKind = 'h2' | 'h3' | 'delete' | 'body' | 'blank'

export interface DraftLine {
  /** 下書きでの行番号（1始まり） */
  lineNumber: number
  kind: LineKind
  /** 下書きに書かれていたままの行 */
  raw: string
  /** 出力する文字列（`h3` の目印や前後の空白を除いたもの） */
  text: string
}

/** 構成メモ用の区切り。行全体がこれと一致したら削除する */
const SEPARATORS = ['書き出し＆問題定義', '解決策＆詳細説明', '〆']

/** `h3` の目印。半角・全角スペースのどちらで区切っても認める */
const H3_PREFIX = /^h3[ 　]+/i

function classify(trimmed: string): { kind: LineKind; text: string } {
  if (trimmed === '') return { kind: 'blank', text: '' }
  if (SEPARATORS.includes(trimmed.replaceAll('&', '＆'))) {
    return { kind: 'delete', text: trimmed }
  }
  const h3 = trimmed.match(H3_PREFIX)
  if (h3) return { kind: 'h3', text: trimmed.slice(h3[0].length) }
  if (!trimmed.endsWith('。')) return { kind: 'h2', text: trimmed }
  return { kind: 'body', text: trimmed }
}

/** 下書きを行ごとに分け、それぞれの種類を判定する */
export function parseDraft(draft: string): DraftLine[] {
  if (draft === '') return []
  return draft.split(/\r\n|\r|\n/).map((raw, index) => {
    const { kind, text } = classify(raw.trim())
    return { lineNumber: index + 1, kind, raw, text }
  })
}
