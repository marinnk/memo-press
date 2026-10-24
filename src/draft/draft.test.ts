import { describe, expect, test } from 'vitest'
import { draftReducer, type DraftState } from './draftState'
import { DRAFT_STORAGE_KEY, loadDraft, saveDraft, type DraftStorage } from './draftStorage'
import { exportFileName, formatSavedTime } from './format'

const draft = [
  '3:4(2K)を選んでおけば間違いない',
  'いろいろ試したけどこのサイズが1番ちょうどよかったです。',
  '',
  'h3 手順1 アイビスを開く',
  'マイギャラリーを押します。',
].join('\n')

function createStorage(): DraftStorage & { items: Map<string, string> } {
  const items = new Map<string, string>()
  return {
    items,
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value)
    },
  }
}

describe('下書きの保存と読み込み', () => {
  test('保存した下書きを、改行も含めてそのまま読み込める', () => {
    const storage = createStorage()
    expect(saveDraft(storage, { text: draft, savedAt: 1000 })).toBe(true)
    expect(loadDraft(storage)).toEqual({ text: draft, savedAt: 1000 })
  })

  test('保存がなければ null', () => {
    expect(loadDraft(createStorage())).toBeNull()
  })

  test('保存内容が壊れていれば null', () => {
    const storage = createStorage()
    storage.items.set(DRAFT_STORAGE_KEY, '{壊れたJSON')
    expect(loadDraft(storage)).toBeNull()
    storage.items.set(DRAFT_STORAGE_KEY, JSON.stringify({ text: 123 }))
    expect(loadDraft(storage)).toBeNull()
  })

  test('ストレージが使えない・容量超過でもエラーにせず、保存できなかったことを返す', () => {
    const broken: DraftStorage = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(loadDraft(broken)).toBeNull()
    expect(saveDraft(broken, { text: draft, savedAt: 1000 })).toBe(false)
    expect(loadDraft(undefined)).toBeNull()
    expect(saveDraft(undefined, { text: draft, savedAt: 1000 })).toBe(false)
  })
})

describe('下書きの削除と元に戻す', () => {
  const initial: DraftState = { text: draft, clearedText: null }

  test('削除すると空になり、元に戻すと削除前の下書きに戻る', () => {
    const cleared = draftReducer(initial, { type: 'clear' })
    expect(cleared).toEqual({ text: '', clearedText: draft })
    expect(draftReducer(cleared, { type: 'undoClear' })).toEqual(initial)
  })

  test('削除後に別の下書きを貼り付けたら、元に戻す対象は消える', () => {
    const cleared = draftReducer(initial, { type: 'clear' })
    const next = draftReducer(cleared, { type: 'edit', text: '次の記事' })
    expect(next).toEqual({ text: '次の記事', clearedText: null })
    expect(draftReducer(next, { type: 'undoClear' })).toBe(next)
  })

  test('空の下書きを削除しても、元に戻す対象は上書きされない', () => {
    const cleared = draftReducer(initial, { type: 'clear' })
    expect(draftReducer(cleared, { type: 'clear' })).toBe(cleared)
  })
})

describe('表示用の書式', () => {
  const date = new Date(2026, 9, 4, 9, 5)

  test('保存時刻は「時:分」を2桁ずつで表示する', () => {
    expect(formatSavedTime(date)).toBe('09:05')
  })

  test('書き出すファイル名に日時を入れる', () => {
    expect(exportFileName(date)).toBe('memo-press-20261004-0905.txt')
  })
})
