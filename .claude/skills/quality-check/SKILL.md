---
name: quality-check
description: Run a comprehensive code-quality review of memo-press (Vite + React + TypeScript, browser-only) — automated lint/test/build checks plus a deeper review comparing the implementation against README.md, the separation between the parsing/checking logic and React components, and common React anti-patterns. Use whenever the user asks for a "品質チェック"/"quality check"/"code review" of the whole app, wants to know if the codebase has drifted from best practices or from the README, or asks to check the app before a release/milestone. Do not use this for routine per-PR verification — CI covers that; this skill is for the periodic, deeper review.
---

# 品質チェック

このアプリ（Vite + React + TypeScript、ブラウザ内で完結）の品質を、自動チェックと設計レベルのレビューの2段階で確認する手順。

## この手順を使うタイミング

CIが毎回のpush・PRで自動的にlint/test/buildを実行している場合、**このスキル全体を毎回のPRごとに実行する必要はない**。以下のようなタイミングで使う。

- まとまった機能追加が一段落したとき
- 個人開発のペースなら1〜2ヶ月に1回程度
- 「なんとなくコードが雑然としてきた」と感じたとき
- 公開や大きな区切りの前

## 第1段階：自動チェック（毎回同じ、機械的に実行）

```sh
npm run lint
npm run test
npm run build
```

## 第2段階：設計レベルのレビュー（自動化できない部分）

### READMEとの整合性

- READMEの「機能」に書かれた変換ルール（「。」で終わらない行はh2、先頭に`h3`をつけた行はh3、構成メモ用の区切りは削除、`<p>`はつけない）が、実装とテストの内容と一致しているか
- 未実装の機能が、READMEで実装済みのように書かれていないか（「開発中」「予定」の表記が実態に合っているか）
- 公開URL・スクリーンショットなどの記載が最新か

### 変換・チェック処理のチェック観点

- 下書きの解析・HTMLへの変換・文章チェックが、Reactに依存しない純粋な関数になっているか（コンポーネントの中に処理が書かれていないか）
- 変換とチェックが、同じ中間データ（行の種類の並び）を使っているか。同じ判定ロジックが2か所に重複していないか
- 実際の下書きを入力にしたテストがあるか。新しく追加したルールにテストが抜けていないか
- 出力するHTMLで、下書き中の`<`・`>`・`&`などが意図せずタグとして解釈されないか

### フロントエンドのチェック観点

- アクセシビリティ：`.oxlintrc.json`に`jsx-a11y`相当のルールが有効化されているか。ボタン・入力欄にラベルがあるか。キーボードだけで操作できるか
- 責務分離：状態管理・ブラウザへの保存などのロジックがカスタムフックに分離され、コンポーネントが表示に専念しているか
- ブラウザへの保存：保存データが壊れていたり、保存が使えない環境（プライベートブラウズ等）でも画面が表示できるか
- 入力のたびに重い処理が走り、入力がもたつかないか
- テンプレート由来のものなど、未使用のアセット・importが残っていないか

## レポートのまとめ方

第1段階（自動チェック）の結果と、第2段階（観点ごとの気づき）を分けて報告する。第2段階は「問題」と決めつけず、「気になった点」として提示し、対応するかどうか・どの粒度で進めるか（Issueを分けるか、まとめるか）はユーザーに確認してから着手する。CLAUDE.mdのIssue駆動開発フローに従い、実際にコードを直す場合は必ずIssue→ブランチ→PRの手順を踏む。
