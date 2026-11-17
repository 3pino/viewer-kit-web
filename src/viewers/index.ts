// 拡大表示（写真・PDF・ライブの映像の全画面）の部品と決まり。
// 個別に読むなら `@3pino/viewer-kit-web/viewers/<名前>`。既定の部品の一覧は defaultViewers。
export * from './types';
export { swipeOutcome, SLIDE_GAP, SWIPE_EDGE_RESISTANCE } from './lightboxSwipe';
export { default as LightboxView } from './LightboxView.svelte';
export { default as ImageViewer } from './ImageViewer.svelte';
export { default as PdfViewer } from './PdfViewer.svelte';
export { default as PdfThumb } from './PdfThumb.svelte';
export { loadPdfjs } from './pdfjs';
export { pdfThumb, PDF_THUMB_MAX_BYTES } from './pdfThumb';
export { PDF_MIN_ZOOM, PDF_MAX_ZOOM, PDF_DOUBLE_TAP_ZOOM, clampZoom, stepZoom, anchoredScroll } from './pdfZoom';

import ImageViewer from './ImageViewer.svelte';
import PdfViewer from './PdfViewer.svelte';
import type { ViewerRegistry } from './types';

/** 既定の種類（image・pdf）の部品。アプリは、これに自分の種類を足して渡してよい */
export const defaultViewers: ViewerRegistry = { image: ImageViewer, pdf: PdfViewer };
