import { useMemo } from 'react'
import { parseDraft } from '../converter/parseDraft'
import { buildOutputLines, toHtml } from '../converter/toHtml'

/** 下書きを解析し、行の判定・出力する行・HTMLをまとめて返す */
export function useConvertedDraft(draft: string) {
  return useMemo(() => {
    const lines = parseDraft(draft)
    return { lines, outputLines: buildOutputLines(lines), html: toHtml(lines) }
  }, [draft])
}
