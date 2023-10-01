<script lang="ts">
  import DefinitionCard from '$lib/components/DefinitionCard.svelte';
  export let data: any;

  $: documents = data.documents;
  $: isFirst = data.direction === "FIRST";
  $: isLast = data.direction === "LAST";
  $: hasMoreEntries = data.documents.length > data.entriesPerPage;  

</script>

<div class="py-8 flex-grow flex flex-col items-center">
  <div class="flex-grow flex flex-col gap-8 pb-8">
    {#each documents as document, i (i)}
      {#if i > 0 || documents.length < 4 }
        <DefinitionCard data={ document }/>
      {/if}
    {/each}

  </div>
  <div class="flex-grow-0 join">
    <button class="btn join-item" on:click={() => location.href=`/`} disabled={isFirst || !hasMoreEntries && data.direction === "BEFORE"}>First</button>
    <button class="btn join-item" on:click={() => location.href=`?before=${documents[0].word}`} disabled={isFirst || !hasMoreEntries && data.direction === "BEFORE"}>Previous</button>
    <button class="btn join-item" on:click={() => location.href=`?after=${documents.at(-1).word}`} disabled={isLast || !hasMoreEntries && data.direction === "AFTER"}>Next</button>
    <button class="btn join-item" on:click={() => location.href=`/?last`} disabled={isLast || !hasMoreEntries && data.direction === "AFTER"}>Last</button>
  </div>
</div>



