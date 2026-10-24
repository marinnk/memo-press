export interface DraftState {
  text: string
  /** 「下書きを削除」で消した内容。元に戻せる間だけ持つ */
  clearedText: string | null
}

export type DraftAction = { type: 'edit'; text: string } | { type: 'clear' } | { type: 'undoClear' }

/**
 * 下書きの状態遷移。
 * 削除した直後だけ元に戻せるようにし、続けて入力したら元に戻す対象は捨てる。
 */
export function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'edit':
      return { text: action.text, clearedText: null }
    case 'clear':
      if (state.text === '') return state
      return { text: '', clearedText: state.text }
    case 'undoClear':
      if (state.clearedText === null) return state
      return { text: state.clearedText, clearedText: null }
  }
}
