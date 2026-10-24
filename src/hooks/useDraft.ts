import { useReducer, useState } from 'react'
import { draftReducer, type DraftState } from '../draft/draftState'
import { loadDraft, saveDraft, type DraftStorage } from '../draft/draftStorage'
import { exportFileName } from '../draft/format'

/** 自動保存の状態。保存できた時刻、または保存に失敗したこと */
export type SaveStatus = { kind: 'idle' } | { kind: 'saved'; savedAt: number } | { kind: 'failed' }

/** プライベートブラウズなどでは localStorage に触れるだけで例外になることがある */
function getStorage(): DraftStorage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

function downloadTextFile(fileName: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

/** 下書きの状態を持ち、変更のたびにブラウザへ自動保存する。削除・元に戻す・書き出しもここで扱う */
export function useDraft() {
  const [initial] = useState(() => loadDraft(getStorage()))
  const [state, dispatch] = useReducer(
    draftReducer,
    null,
    (): DraftState => ({ text: initial?.text ?? '', clearedText: null }),
  )
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    initial ? { kind: 'saved', savedAt: initial.savedAt } : { kind: 'idle' },
  )

  const persist = (text: string) => {
    const savedAt = Date.now()
    setSaveStatus(saveDraft(getStorage(), { text, savedAt }) ? { kind: 'saved', savedAt } : { kind: 'failed' })
  }

  const setDraft = (text: string) => {
    dispatch({ type: 'edit', text })
    persist(text)
  }

  const clearDraft = () => {
    if (state.text === '') return
    dispatch({ type: 'clear' })
    persist('')
  }

  const undoClear = () => {
    if (state.clearedText === null) return
    dispatch({ type: 'undoClear' })
    persist(state.clearedText)
  }

  const exportDraft = () => downloadTextFile(exportFileName(new Date()), state.text)

  return {
    draft: state.text,
    canUndoClear: state.clearedText !== null,
    saveStatus,
    setDraft,
    clearDraft,
    undoClear,
    exportDraft,
  }
}
