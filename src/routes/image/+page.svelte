<script lang="ts">
  import AuthCheck from '$lib/components/AuthCheck.svelte';
  import { enhance } from '$app/forms'; 
  import type { SubmitFunction } from '@sveltejs/kit';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { saveImage } from '$lib/client-side-actions.js';

  export const csr = false; // Else tab navigation broke
  
  export let data;

  let previewURL: string;

  let saving = false;

  const platformOptions = [
    'Kakao Entertainment',
    'NAVER Webtoon',
    'Ridi Manta',
    'Lezhin'
  ];

  let imageInputChanged = false;

  let dataAsWas = JSON.stringify(data);

  beforeNavigate((navigation) => {
    const dataChanged = dataAsWas !== JSON.stringify(data);

    if (!dataChanged && !imageInputChanged) return;

    let wannaLeave = confirm("Your unsaved changes will be lost.");

    if (!wannaLeave) navigation.cancel();
  });
     
  function handleImageChange(e: any) {
    imageInputChanged = true;
    const file = e.target.files[0];
    previewURL = URL.createObjectURL(file);
  }

  onMount(() =>{
    if (!browser) return;
    document.addEventListener('keydown', handleShortcuts)
  });

  onDestroy(() =>{
    if (!browser) return;
    document.removeEventListener('keydown', handleShortcuts)
  });

  const handleSave: SubmitFunction = async ({ cancel, formData }) => {

    // https://joyofcode.xyz/working-with-forms-in-sveltekit

    cancel();

    saving = true;

    try {
      await saveImage(formData);
    }
    catch(e: any) {
      alert(e.message);
      console.dir(e);
    }

    dataAsWas = JSON.stringify(data);
    imageInputChanged = false;
    saving = false;

  }

  function handleShortcuts(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const form = document.getElementsByTagName('form')[0];
      form?.requestSubmit();
    }
  }
</script>
 
<AuthCheck>
  <div class="flex flex-col items-center scale-95">
    <main class="w-full md:w-[640px]">
      <div class="tabs self-start translate-y-3">
        <a href="/edit?word={data.word}" class="tab tab-lg rounded-t-xl flex items-start pt-1 bg-base-100">Content</a>
        <a href="/image?word={data.word}" on:click|preventDefault class="tab tab-lg tab-active rounded-t-xl flex items-start pt-1 bg-base-300 text-pink-50">Image</a> 
      </div>
      <article class="card w-full md:w-[640px] bg-base-300 shadow-xl">
        <form class="card-body p-6" method="POST" action="?/saveImage" use:enhance={handleSave}>
  
          <div class="flex justify-between">
            <!-- TITLE -->
            <a href="/{data.word}" class="card-title text-2xl border-base-content leading-8 border-b-[3px] self-start">{data.word}</a>
            <input type="hidden" name="word" value={data.word} />
  
            {#if saving}
              <button class="btn btn-square btn-primary rounded-none" disabled><span class="loading loading-spinner loading-xs"></span></button>
            {:else}
              <button class="btn btn-square btn-primary rounded-none">SAVE</button>
            {/if}
  
          </div>

          <section class="flex gap-2 items-end">
            <div class="flex flex-col gap-2">

              <label for="file">Image file</label>
              <input name="file" type="file" class="file-input file-input-bordered w-full max-w-xs" 
                accept="image/png, image/jpeg, image/gif, image/webp"
                on:change={handleImageChange}
              />

              <input type="hidden" name="previousImageURL" value={data.imageURL}>
              
              <label for="platform">Publisher</label>
              <select class="select select-bordered w-full max-w-xs rounded-lg bg-base-200" bind:value={data.sourcePlatform} name="platform">
          
                  <option value="" selected="{!data.sourcePlatform}" disabled>Choose a publisher</option>
                {#each platformOptions as opt, i (i)}
                  <option selected="{data.sourcePlatform === opt}">{opt}</option>
                {/each}
    
              </select>
            </div>
            
            {#if previewURL}
              <img class="max-h-36 mx-auto" src="{previewURL}" alt="Selection" />
            {:else if data.imageURL}
              <img class="max-h-36 mx-auto" src="{data.imageURL}" alt="Previous illustration" />
            {/if}

          </section>

          <label for="title">Title</label>
          <input type="text" class="textarea textarea-bordered rounded-lg bg-base-200" name="title" bind:value={data.sourceTitle} />
  
          <label for="episode">Episode</label>
          <input type="text" class="textarea textarea-bordered rounded-lg bg-base-200" name="episode" bind:value={data.sourceEpisode} />

          <label for="url">URL</label>
          <input type="text" class="textarea textarea-bordered rounded-lg bg-base-200" name="url" bind:value={data.sourceURL} />
          
        </form>
      </article>
    </main>
  </div>
</AuthCheck>