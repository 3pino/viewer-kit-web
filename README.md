# @3pino/viewer-kit-web

3pino のアプリの拡大表示（写真・PDF・ライブ映像の全画面）の部品。前後の移動・左右のスワイプ・ピンチ・ダウンロードの口を持つ。Svelte 5 / TypeScript のソースのまま配る（ビルド済みの JS は出さない）。

- `@3pino/viewer-kit-web/viewers`: 部品 `LightboxView`・`ImageViewer`・`PdfViewer`・`PdfThumb` と、既定の種類の表 `defaultViewers`。
- `@3pino/viewer-kit-web/viewers/types`: 型（`LightboxItem`・`ViewerKind`・`ViewerProps`・`ViewerRegistry`・`TapMode`）と `adjacentItem`。
- `@3pino/viewer-kit-web/viewers/<名前>`: `lightboxSwipe`・`pdfZoom`・`pdfjs`・`pdfThumb` などを個別に。

使い方と、アプリとの境界は [docs/viewers.md](docs/viewers.md)。

## 依存

- 必須: `svelte` ^5.57、`@3pino/app-kit-web`（`core/zoom`・`core/zoomGesture`）、`@3pino/ui-kit-web`（`IconButton`）、`@3pino/design-system`（見た目のトークン）、`@lucide/svelte`。
- 任意: `pdfjs-dist`（PDF を開くときだけ。写真だけのアプリは入れなくてよい）。

## 配り方

取り込むアプリの `vite.config.ts` の `optimizeDeps.exclude` に入れる（事前バンドルは JS だけを想定するため）。試験で `vi.mock` を効かせるなら `server.deps.inline` にも入れる。

## 開発

```sh
npm install
npm run check   # svelte-check
npm test        # vitest（jsdom）
```

依存の `@3pino/app-kit-web`・`@3pino/ui-kit-web`・`@3pino/design-system` は、開発では隣のリポジトリを `file:` で指す。公開のときはタグの版に戻す。

## ライセンス

MIT（[LICENSE](LICENSE)）。
