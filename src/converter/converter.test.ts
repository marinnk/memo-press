import { describe, expect, test } from 'vitest'
import { parseDraft } from './parseDraft'
import { toHtml } from './toHtml'

const convert = (draft: string) => toHtml(parseDraft(draft))

describe('READMEの変換例', () => {
  test('「。」で終わらない行はh2、h3をつけた行はh3、それ以外はそのまま', () => {
    const draft = [
      '3:4(2K)を選んでおけば間違いない',
      'いろいろ試したけどこのサイズが1番ちょうどよかったです。',
      '',
      'h3 手順1 アイビスを開く',
      'マイギャラリーを押します。',
    ].join('\n')

    expect(convert(draft)).toBe(
      [
        '<h2>3:4(2K)を選んでおけば間違いない</h2>',
        'いろいろ試したけどこのサイズが1番ちょうどよかったです。',
        '',
        '<h3>手順1 アイビスを開く</h3>',
        'マイギャラリーを押します。',
      ].join('\n'),
    )
  })
})

describe('構成メモつきの下書き', () => {
  const draft = [
    '書き出し＆問題定義',
    'アイビスペイントのキャンバスサイズ、どれを選べばいいか迷いますよね。',
    'サイズ選びで失敗すると、あとから描き直すことになってしまいます。',
    '',
    '解決策＆詳細説明',
    '3:4(2K)を選んでおけば間違いない',
    'いろいろ試したけどこのサイズが1番ちょうどよかったです。',
    '',
    'h3 手順1 アイビスを開く',
    'マイギャラリーを押します。',
    '',
    '〆',
    '最初の設定さえ決めておけば、あとは描くだけです。',
  ].join('\n')

  test('区切りを削除し、空行は1つにまとめる', () => {
    expect(convert(draft)).toBe(
      [
        'アイビスペイントのキャンバスサイズ、どれを選べばいいか迷いますよね。',
        'サイズ選びで失敗すると、あとから描き直すことになってしまいます。',
        '',
        '<h2>3:4(2K)を選んでおけば間違いない</h2>',
        'いろいろ試したけどこのサイズが1番ちょうどよかったです。',
        '',
        '<h3>手順1 アイビスを開く</h3>',
        'マイギャラリーを押します。',
        '',
        '最初の設定さえ決めておけば、あとは描くだけです。',
      ].join('\n'),
    )
  })

  test('各行の種類と行番号を判定する', () => {
    expect(parseDraft(draft).map((line) => [line.lineNumber, line.kind])).toEqual([
      [1, 'delete'],
      [2, 'body'],
      [3, 'body'],
      [4, 'blank'],
      [5, 'delete'],
      [6, 'h2'],
      [7, 'body'],
      [8, 'blank'],
      [9, 'h3'],
      [10, 'body'],
      [11, 'blank'],
      [12, 'delete'],
      [13, 'body'],
    ])
  })
})

describe('文末の記号', () => {
  test('「！」「？」で終わる行は見出しにせず本文として扱う', () => {
    const draft = [
      'サイズ選びで迷っていませんか？',
      'これで完璧です！',
      '半角でも大丈夫?',
      '半角でも大丈夫!',
      '本当に？！',
    ].join('\n')
    expect(parseDraft(draft).map((line) => line.kind)).toEqual(['body', 'body', 'body', 'body', 'body'])
    expect(convert(draft)).toBe(draft)
  })
})

describe('メモ帳の書き方の揺れ', () => {
  test('Windowsのメモ帳の改行（CRLF）でも同じ結果になる', () => {
    const draft = '見出し\r\n本文です。\r\n\r\nh3 小見出し\r\n本文です。'
    expect(convert(draft)).toBe('<h2>見出し</h2>\n本文です。\n\n<h3>小見出し</h3>\n本文です。')
  })

  test('h3の後ろが全角スペースでも、大文字のH3でも見出し3になる', () => {
    expect(convert('h3　手順1\nH3 手順2')).toBe('<h3>手順1</h3>\n<h3>手順2</h3>')
  })

  test('行の前後の空白は取り除き、空白だけの行は空行として扱う', () => {
    expect(convert('見出し　\n  本文です。 \n　\n\n本文です。')).toBe(
      '<h2>見出し</h2>\n本文です。\n\n本文です。',
    )
  })

  test('区切りの「＆」が半角でも削除する', () => {
    expect(convert('書き出し&問題定義\n本文です。')).toBe('本文です。')
  })

  test('区切りと同じ言葉を含むだけの行は削除しない', () => {
    expect(convert('解決策＆詳細説明を書く')).toBe('<h2>解決策＆詳細説明を書く</h2>')
  })

  test('先頭と末尾の空行は出力しない', () => {
    expect(convert('\n\n本文です。\n\n')).toBe('本文です。')
  })

  test('空の下書きは空文字になる', () => {
    expect(parseDraft('')).toEqual([])
    expect(convert('')).toBe('')
  })
})
