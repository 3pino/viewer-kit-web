<script lang="ts">
  // 試験用: 拡大表示の箱（LightboxBox）を LightboxView につなぐ（アプリの ui の代わり）
  import LightboxView from '../viewers/LightboxView.svelte';
  import { defaultViewers } from '../viewers';
  import type { LightboxBox } from './lightboxBox.svelte';

  let { box, errorText }: { box: LightboxBox; errorText?: (e: unknown) => string } = $props();
</script>

<LightboxView
  item={box.current}
  gallery={box.gallery}
  viewers={defaultViewers}
  {errorText}
  onchange={(i) => (box.current = i)}
  onclose={() => (box.current = null)}
/>
