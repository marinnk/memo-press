const pad2 = (value: number) => String(value).padStart(2, '0')

/** 保存時刻を「14:32」の形にする */
export function formatSavedTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

/** 書き出すファイルの名前。「memo-press-20261024-1432.txt」の形にする */
export function exportFileName(date: Date): string {
  const day = `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`
  return `memo-press-${day}-${pad2(date.getHours())}${pad2(date.getMinutes())}.txt`
}
