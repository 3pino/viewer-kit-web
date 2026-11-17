// PDF のサムネイルの見た目の決まり（枠に全体を収める）。CSS は部品の <style> から読む（ファイルの場所は、このパッケージの中だけ）
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const COMPONENT = fileURLToPath(new URL('./PdfThumb.svelte', import.meta.url));

describe('PdfThumb の見た目の決まり', () => {
  it('サムネイルは欠けないよう、全体を枠に収める（object-fit: contain）', () => {
    const css = readFileSync(COMPONENT, 'utf8').split('<style>')[1] ?? '';
    expect(css, '<style> がある').not.toBe('');
    expect(css).toMatch(/object-fit:\s*contain/);
    expect(css).not.toMatch(/object-fit:\s*cover/);
  });
});
