---
name: run-app
description: Start the Vite dev server for local verification of memo-press. Use whenever you need to run/launch/preview the app, take a screenshot, or manually confirm a change works in the browser.
---

# アプリの起動手順

このプロジェクトを実際に動かして確認するときは、必ずこの手順に従うこと。

## 前提: ポートは固定。競合したら「別ポートで動かす」のは禁止

- 開発サーバー（Vite）: 必ず **5173**

Viteはポートが使用中だと**黙って**5174などの別ポートに自動で切り替わって起動してしまう。「動いていればOK」ではなく、**5173で動いていることを毎回確認する**こと。別ポートで起動した状態のまま作業を進めない。

## 起動前: ポート競合の確認・解消

起動する前に、5173番ポートを使っているプロセスがないか確認し、あれば停止する。

```sh
lsof -ti:5173 -sTCP:LISTEN | xargs -r kill
```

`.claude/settings.json`で`kill -9`は禁止されている。まずは通常の`kill`（SIGTERM）で止め、それでも残る場合はユーザーに相談する。

## 起動手順

```sh
npm install   # 初回、またはpackage.jsonが変わったときのみ
npm run dev   # バックグラウンドで起動し、以降のコマンドは別途実行する
```

## 起動後の確認

```sh
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/
```

200が返らない場合は、5173番ポートを使っている別プロセスがいないか再度`lsof`で確認し、止めてから起動し直す。

## 本番ビルドでの確認（任意）

公開時と同じ状態で確認したい場合は、ビルドしてからプレビューサーバー（既定4173番）を起動する。

```sh
npm run build
npm run preview
```

## ブラウザでの見た目確認（任意）

`chromium-cli`が使えない場合、`playwright-core` + ローカルのGoogle Chromeで代替できる:

```sh
npm install playwright-core   # スクラッチディレクトリ等、一時的な場所で
```

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
```

## 後片付け

検証のためだけに起動したサーバーは、作業終了時に停止する。ただし、ユーザーが引き続き動作確認等で使う様子なら、勝手に止めずに確認する。

```sh
lsof -ti:5173 -sTCP:LISTEN | xargs -r kill
```
