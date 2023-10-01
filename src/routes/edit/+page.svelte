<script lang="ts">
  import AuthCheck from '$lib/components/AuthCheck.svelte';
  import { enhance } from '$app/forms'; 
  import type { SubmitFunction } from '@sveltejs/kit';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { save, destroy } from '$lib/client-side-actions';

  export const csr = false; // Else tab navigation broke
  
  export let data: DictionaryEntry;

  if (!data.definitions.length) data.definitions = ['']; // Show at least one input box

  let dataAsWas = JSON.stringify(data); // Almost as-was, may have added an empty definition above

  let saving = false;
  let deleting = false;

  beforeNavigate((navigation) => {
    const dataChanged = dataAsWas !== JSON.stringify(data);
    if (!dataChanged) return;

    let wannaLeave = confirm("Your unsaved changes will be lost.");

    if (!wannaLeave) navigation.cancel();
  });

  onMount(() =>{
    if (!browser) return;
    document.addEventListener('keydown', handleShortcuts);
  });

  onDestroy(() =>{
    if (!browser) return;
    document.removeEventListener('keydown', handleShortcuts)
  });

  const handleSaveOrDelete: SubmitFunction = async ({ action, cancel, formData }) => {
    // https://joyofcode.xyz/working-with-forms-in-sveltekit

    cancel();

    switch (action.search) {
      case "?/delete":
        if (!confirm("Are you sure?")) {
          return;
        }

        if (!confirm("Double sure?")) {
          return;
        }

        deleting = true;

        try {
          await destroy(formData);
        }
        catch(e: any) {
          alert(e.message);
          console.dir(e);
        }
        
        dataAsWas = JSON.stringify(data); // Don't ask "Do you wanna save?"
        deleting = false;

        break;


      case "?/save":
        saving = true;

        try {
          await save(formData);
        }
        catch(e: any) {
          alert(e.message);
          console.dir(e);
        }
        
        dataAsWas = JSON.stringify(data);
        saving = false;
        break;
    }
  }

  function handleShortcuts(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const form = document.getElementsByTagName('form')[0];
      form?.requestSubmit();
    }
  }

  function addDefinitionBox() {
    data.definitions = [...data.definitions, ''] as string[];
  }

  function focus(el: HTMLElement) {
    el.focus();
  }

  function removeDefinitionBox() {
    const firstBlank = data.definitions?.indexOf('');
    if (firstBlank != null && firstBlank >= 0) {
      data.definitions!.splice(firstBlank, 1);
      data.definitions = [...data.definitions];
    }
  }

   
</script>

<AuthCheck>

<div class="flex flex-col items-center justify-start scale-95">
  <main class="w-full md:w-[640px]">
    <div class="tabs self-start translate-y-3">
      <a href="/edit?word={data.word}" on:click|preventDefault class="tab tab-lg tab-active rounded-t-xl bg-base-100 flex items-start pt-1">Content</a> 
      <a href="/image?word={data.word}" class="tab tab-lg rounded-t-xl flex items-start pt-1 bg-base-300 text-pink-100 hover:text-pink-50">Image</a> 
    </div>
    <article class="card w-full md:w-[640px] bg-base-100 shadow-xl">
      <form class="card-body p-6" method="POST" action="?/save" use:enhance={handleSaveOrDelete}>


        <div class="flex justify-between">
          <!-- TITLE -->
          <a href="/{data.word}" class="card-title text-2xl border-base-content leading-8 border-b-[3px] self-start">{data.word}</a>
          <input type="hidden" name="word" value={data.word} />

          <div class="flex items-center gap-2">
            {#if deleting}
              <button class="w-20 btn bg-pink-100   rounded-none" disabled><span class="loading loading-spinner loading-xs"></span></button>
            {:else}
              <button class="w-20 btn bg-base-200 rounded-none" formaction="?/delete" >DELETE</button>
            {/if}

            {#if saving}
              <button class="btn btn-square btn-primary rounded-none" disabled><span class="loading loading-spinner loading-xs"></span></button>
            {:else}
              <button class="btn btn-square btn-primary rounded-none">SAVE</button>
            {/if}
          </div>
        </div>
        

        <h2>Definitions</h2>
        <section id="definitions" class="p-3 rounded-lg border-2 border-base-300 border-dashed flex flex-col">

          {#each data.definitions as def, i(i)}

            <!-- div as fake input, so it auto-grows vetically -->
              <div data-class="definition" class="textarea textarea-bordered rounded-lg bg-pink-100 mb-2"
              contenteditable="true"
              use:focus
              bind:innerText={data.definitions[i]}
              >{def}</div>

            <!-- hidden input pulling value from div, so its included on form submit -->
            <input type="hidden" name="{`def-${i}`}" bind:value={data.definitions[i]} />
            
          {/each}

          <div class="join gap-2 flex-wrap justify-end">
            <button class="btn btn-circle text-2xl" on:click|preventDefault={removeDefinitionBox} >-</button> 
            <button class="btn btn-circle text-2xl" on:click|preventDefault={addDefinitionBox} >+</button>
          </div>

        </section>


        <h2>Tags</h2>
        <input type="text" class="textarea textarea-bordered rounded-lg bg-pink-100" name="tags" bind:value={data.tags} />


        <h2>Translations</h2>
        <input type="text" class="textarea textarea-bordered rounded-lg bg-pink-100" name="translations" bind:value={data.translations} />


        <h2>Variants</h2>
        <input type="text" class="textarea textarea-bordered rounded-lg bg-pink-100" name="variants" bind:value={data.variants} />


        <h2>Similars</h2>
        <input type="text" class="textarea textarea-bordered rounded-lg bg-pink-100" name="similars" bind:value={data.similars} />
        
      </form>
    </article>
  </main>
</div>

</AuthCheck>
