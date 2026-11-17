// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import LightboxHost from '../test-support/LightboxHost.svelte';
import { LightboxBox } from '../test-support/lightboxBox.svelte';
import type { LightboxItem } from './types';

/** 拡大表示の状態の箱（ui.lightbox の代わり）。試験の中で値を見る・置く */
const box = new LightboxBox();
/** 開く（ui.openLightbox の代わり。一覧も渡す） */
const openFlow = (item: LightboxItem, list: () => LightboxItem[]): void => box.open(item, list);
const mountBox = () => mount(LightboxHost, { target: document.body, props: { box } });

// PDF のプレビュー（Lightbox の kind: 'pdf'）。pdf.js は差し替える（ページの数と大きさだけ返す）
const h = vi.hoisted(() => ({
  getDocument: vi.fn((_opts: { url: string; isEvalSupported: boolean; disableAutoFetch?: boolean; disableStream?: boolean }) => ({
    promise: Promise.resolve({
      numPages: 3,
      getPage: async () => ({
        getViewport: ({ scale }: { scale: number }) => ({ width: 600 * scale, height: 800 * scale }),
        render: () => ({ promise: Promise.resolve(), cancel: () => {} }),
      }),
    }),
    destroy: async () => {},
  })),
}));
vi.mock('./pdfjs', () => ({ loadPdfjs: async () => ({ getDocument: h.getDocument }) }));

let instance: ReturnType<typeof mount> | undefined;
beforeEach(() => {
  // bind:clientWidth は ResizeObserver を使う（jsdom には無い）
  if (!('ResizeObserver' in globalThis)) {
    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});
afterEach(async () => {
  if (instance) await unmount(instance);
  instance = undefined;
  box.reset();
  document.body.innerHTML = '';
});

describe('PDF のプレビュー', () => {
  it('ページを縦に並べ、ページ数と拡大・縮小を出す。PDF の中のスクリプトは評価しない', async () => {
    instance = mountBox();
    box.current = { src: 'http://s/api/shared/a.pdf', alt: 'a.pdf', downloadUrl: 'http://s/api/shared/a.pdf', kind: 'pdf' };
    flushSync();
    await vi.waitFor(() => expect(document.querySelectorAll('.pdf-viewer-page')).toHaveLength(3));
    expect(h.getDocument).toHaveBeenCalledWith(expect.objectContaining({ url: 'http://s/api/shared/a.pdf', isEvalSupported: false, disableAutoFetch: true, disableStream: true }));
    expect(document.querySelector('.pdf-viewer-count')?.textContent).toBe('3 ページ');
    // 画像の舞台は出さない。ファイル名・ダウンロード・閉じるは画像と同じ
    expect(document.querySelector('.image-viewer')).toBeNull();
    expect(document.querySelector('.lightbox-file-name')?.textContent).toBe('a.pdf');
    const zoomOut = document.querySelector<HTMLButtonElement>('button[aria-label="縮小"]')!;
    const zoomIn = document.querySelector<HTMLButtonElement>('button[aria-label="拡大"]')!;
    expect(zoomOut.disabled).toBe(true);
    zoomIn.click();
    flushSync();
    expect(zoomOut.disabled).toBe(false);
  });

  it('等倍の PDF では ←→ キーで前後へ移る。拡大中は移らない（横スクロールに残す）', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    instance = mountBox();
    const pdf = { src: 'a.pdf', alt: 'a.pdf', downloadUrl: 'a.pdf', kind: 'pdf' as const };
    const png = { src: 'b.png', alt: 'b.png', downloadUrl: 'b.png' };
    openFlow(pdf, () => [pdf, png]);
    flushSync();
    await vi.waitFor(() => expect(document.querySelector('.lightbox-slide-current .pdf-viewer-page')).not.toBeNull());
    // 拡大中
    document.querySelector<HTMLButtonElement>('button[aria-label="拡大"]')!.click();
    flushSync();
    const zoomed = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    window.dispatchEvent(zoomed);
    vi.advanceTimersByTime(300);
    flushSync();
    expect(zoomed.defaultPrevented).toBe(false);
    expect(box.current?.src).toBe('a.pdf');
    // 等倍に戻すと移る
    document.querySelector<HTMLButtonElement>('button[aria-label="縮小"]')!.click();
    flushSync();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    vi.advanceTimersByTime(300);
    flushSync();
    expect(box.current?.src).toBe('b.png');
    vi.useRealTimers();
  });

  it('隣（前後）の PDF も開いておくが、拡大・縮小のボタンはいま見ているものだけに出す', async () => {
    instance = mountBox();
    const png = { src: 'b.png', alt: 'b.png', downloadUrl: 'b.png' };
    const pdf = { src: 'c.pdf', alt: 'c.pdf', downloadUrl: 'c.pdf', kind: 'pdf' as const };
    openFlow(png, () => [png, pdf]);
    flushSync();
    await vi.waitFor(() => expect(document.querySelectorAll('.pdf-viewer-page')).toHaveLength(3));
    expect(document.querySelector('button[aria-label="拡大"]')).toBeNull();
  });

  it('読めなかったときの文は、アプリの errorText で決まる（既定の文ではない）', async () => {
    h.getDocument.mockImplementationOnce(() => {
      throw Object.assign(new Error('boom'), { code: 'NOT_FOUND' });
    });
    const errorText = (e: unknown) => `アプリの文: ${(e as { code?: string }).code}`;
    instance = mount(LightboxHost, { target: document.body, props: { box, errorText } });
    box.current = { src: 'x.pdf', alt: 'x.pdf', downloadUrl: 'x.pdf', kind: 'pdf' };
    flushSync();
    await vi.waitFor(() => expect(document.querySelector('.pdf-viewer-status')?.textContent).toContain('アプリの文: NOT_FOUND'));
  });

  it('画像（kind なし）は、これまでどおり画像を出す', () => {
    instance = mountBox();
    box.current = { src: 'x.png', alt: 'x.png', downloadUrl: 'x.png' };
    flushSync();
    expect(document.querySelector('.image-viewer')).not.toBeNull();
    expect(document.querySelector('.pdf-viewer')).toBeNull();
  });
});
