import { useCallback, useEffect, useRef, useState } from 'react'

export type CopyStatus = 'idle' | 'copied' | 'failed'

/** 文字列をクリップボードにコピーし、結果をしばらく表示できるように返す */
export function useClipboard(resetAfterMs = 1600) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const copy = useCallback(
    async (text: string) => {
      window.clearTimeout(timerRef.current)
      try {
        await navigator.clipboard.writeText(text)
        setStatus('copied')
      } catch {
        setStatus('failed')
      }
      timerRef.current = window.setTimeout(() => setStatus('idle'), resetAfterMs)
    },
    [resetAfterMs],
  )

  return { status, copy }
}
