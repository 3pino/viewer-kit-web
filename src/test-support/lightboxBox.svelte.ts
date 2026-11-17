// 試験用の拡大表示の箱（アプリの ui の代わり）。$state なので、試験の中の代入が画面へ届く
import type { LightboxItem, LightboxGallery } from '../viewers/types';

export class LightboxBox {
  current = $state<LightboxItem | null>(null);
  gallery = $state<LightboxGallery | null>(null);
  open(item: LightboxItem, list: LightboxGallery): void {
    this.current = item;
    this.gallery = list;
  }
  reset(): void {
    this.current = null;
    this.gallery = null;
  }
}
