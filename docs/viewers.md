# viewers（拡大表示の部品と境界）

## 何を持つか

- `LightboxView`: 全画面の表示。前後の切り替え（←→ キー・1 本指の横スワイプ）、ツールバー（ファイル名・ダウンロード・閉じる）、端末の安全域。表示するものと一覧は props で受け、状態は持たない。
- ビューアー（種類ごとの部品）: `ImageViewer`（写真。ピンチ・ダブルタップ・パン）、`PdfViewer`（pdf.js で全ページを縦に並べる。拡大段階は `pdfZoom`）。
- `PdfThumb`: 1 ページ目のサムネイル（画面に入ってから作る。大きすぎる PDF は作らない）。
- `types`: 型と前後の決まり（`adjacentItem`）。

## アプリが渡すもの（境界）

| prop | 誰が決めるか | 既定 |
|---|---|---|
| `item`・`gallery`・`onchange`・`onclose` | アプリ（今見ている 1 件と、前後の一覧） | — |
| `viewers` | アプリ。種類 → 部品の表（`defaultViewers` に足してよい） | 必須 |
| `ondownload(ev, item)` | アプリ。`true` を返すと（アプリが保存した）すぐ閉じる。`false` なら既定の保存の後に閉じる | 無し（ダウンロードは `<a download>` のまま） |
| `errorText(e)` | アプリ。読めなかったときの文 | 「ファイルを読めませんでした」 |
| `download` | アプリ。ダウンロードのボタンを出すか | `true` |
| `tapMode`・`onmediatap` | アプリ（ライブ映像で、画像の上のタップを閉じずに渡す） | `'close'` |
| `navigable`・`closeOnEscape`・`chrome` | アプリ | `true` |

## 種類（kind）

`ViewerKind` は文字列。どのファイルがどの種類かは、アプリが決める（例: disnans は `lib/viewers.ts` の `viewerKind`）。種類を足すには、`ViewerProps` を受ける部品を作り、`viewers` の表に入れる。

## 持たないもの（アプリの側に残す）

- URL・認証・サーバー設定・添付の取得（`src` と `downloadUrl` はアプリが作る）。
- 保存の方法（Tauri の直接保存、ブラウザーの `<a download>`）。
- チャットの画像の一覧（どのメッセージの画像を前後にたどるか）。
- ファイルの種類の見分け（MIME・拡張子）。
- 共有の画面の映像（ScreenShareViewer。拡大表示の部品を props で使う）。
