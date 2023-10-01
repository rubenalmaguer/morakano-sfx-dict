<script lang="ts">
  // https://stackoverflow.com/questions/71789244/where-to-put-images-with-sveltekit
  // https://stackoverflow.com/questions/75481013/how-to-properly-address-images-and-assets-in-sveltekit

  export let word: any;
  export let imageInfo: any;

  const isInfoComplete = imageInfo.sourceURL && imageInfo.sourceTitle && imageInfo.sourceEpisode && imageInfo.sourcePlatform;

  const urlByPlatform: any = {
    'NAVER Webtoon': 'https://comic.naver.com/'
  }

  const imagePath = imageInfo.imageURL;
  const promisedImage = new Promise((resolve, reject) => {
    // Check if image path is valid
    const image = new Image();
    image.src = imagePath;
    image.onerror = reject;
    image.onload = resolve;
  });

  const showImageMeta = () => {
    const selector = `#meta-modal-for-${word}`
    const imageModal: HTMLDialogElement | null = document.querySelector(selector);
    imageModal?.showModal();
  }

  function handleImgError() {
    document.querySelector(`[src="${imagePath}"]`)?.remove();
  }

</script>

{#await promisedImage}
<!-- No image, use spacer to minimize layout shift -->
  <div class="aspect-square w-1/4 md:w-1/3 p-2 md:p-4 ml-4 mb-4 float-right"></div>

{:then _ }
<!-- https://github.com/sveltejs/kit/issues/8271 -->
  <button class="w-1/4 md:w-1/3 p-2 md:p-4 ml-4 mb-4 bg-white shadow-md float-right" on:click={showImageMeta}>
    <img 
      src="{imagePath}"
      alt="{word}"
    />
</button>

{:catch}
<!-- No image -->

{/await}

<!-- Modal -->
<dialog id="{`meta-modal-for-${word}`}" class="modal">
  <div class="modal-box overflow-clip">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>

    {#if isInfoComplete}
    <h3>From: 
      <a class="link" target="_blank" href="{imageInfo.sourceURL}">{imageInfo.sourceTitle} {imageInfo.sourceEpisode}</a>
    </h3>
    <h3>Published by: 
      <a class="link" target="_blank" href="{urlByPlatform[imageInfo.sourcePlatform]}">{imageInfo.sourcePlatform}</a>
    </h3>
    
    {/if}

    <img 
    class="mt-6"
    src="{imagePath}"
    alt="{word}"
    />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>