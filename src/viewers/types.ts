// 拡大表示（ビューアー）の型と、前後をたどる決まり。どのアプリでも同じもの。
// 種類（kind）の見分け方・どの URL を出すか・保存の方法は、アプリが決めて渡す（この部品は持たない）。

import type { Component } from 'svelte';

/** ビューアーの種類（アプリごと。既定は 'image' と 'pdf'。アプリは string の値を足してよい） */
export type ViewerKind = 'image' | 'pdf' | (string & {});

/** 背景・画像のタップの扱い。'close'（既定）: 等倍の 1 回のタップで閉じる。'media': 画像の上のタップは閉じず onimagetap を呼ぶ */
export type TapMode = 'close' | 'media';

/** 拡大表示の 1 件。kind はビューアーの種類。無ければ画像 */
export type LightboxItem = {
  src: string;
  alt: string;
  /** ダウンロードのリンク（アプリが決める URL） */
  downloadUrl: string;
  kind?: ViewerKind;
  /** 同じものの src が変わり続けるとき（ライブの映像）の見分け。無ければ src */
  key?: string;
};

/** 前後をたどる一覧。呼ぶたびに今の一覧を返す */
export type LightboxGallery = () => LightboxItem[];

/**
 * ビューアーの部品が受け取るもの。
 * - 拡大・縮小・移動はビューアーが受け持ち、等倍か（zoomed）を onzoom で知らせる。
 *   等倍のときは、1 本指の左右の動き・←→ キーを LightboxView が前後の切り替えに使う（ビューアーは受けない）
 * - active でないもの（スワイプで隣に見えている前後のファイル）は、操作を受けず、等倍に戻しておく
 * - errorText: 読めなかったときの文（アプリが決める。無ければ既定の文）
 */
export type ViewerProps = {
  src: string;
  alt: string;
  active: boolean;
  onzoom?: (zoomed: boolean) => void;
  ontap?: () => void;
  tapMode?: TapMode;
  onimagetap?: () => void;
  errorText?: (e: unknown) => string;
};

/** 種類 → ビューアーの部品 */
export type ViewerRegistry = Record<string, Component<ViewerProps>>;

/** 前（delta < 0）・次（delta > 0）の項目。いまの項目が一覧に無い、または端で続きが無いときは null */
export function adjacentItem(items: readonly LightboxItem[], src: string, delta: -1 | 1): LightboxItem | null {
  const i = items.findIndex((it) => it.src === src);
  if (i < 0) return null;
  return items[i + delta] ?? null;
}
