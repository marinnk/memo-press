/** ブラウザ（localStorage）に下書きを保存するときのキー */
export const DRAFT_STORAGE_KEY = 'memo-press:draft'

export interface SavedDraft {
  text: string
  /** 保存した時刻（エポックミリ秒） */
  savedAt: number
}

/** 保存先。テストでは同じ形のオブジェクトに差し替える */
export type DraftStorage = Pick<Storage, 'getItem' | 'setItem'>

/**
 * 保存されている下書きを読み込む。
 * 保存がない・形式が壊れている・ストレージが使えない場合は null を返す。
 */
export function loadDraft(storage: DraftStorage | undefined): SavedDraft | null {
  try {
    const raw = storage?.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (
      typeof data === 'object' &&
      data !== null &&
      'text' in data &&
      'savedAt' in data &&
      typeof data.text === 'string' &&
      typeof data.savedAt === 'number'
    ) {
      return { text: data.text, savedAt: data.savedAt }
    }
    return null
  } catch {
    return null
  }
}

/** 下書きを保存する。容量超過などで保存できなかった場合は false を返す */
export function saveDraft(storage: DraftStorage | undefined, draft: SavedDraft): boolean {
  if (!storage) return false
  try {
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}
