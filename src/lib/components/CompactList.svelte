<script lang="ts">
  export let title: string;
  export let items: string[];
  export let linkify: boolean = false;
</script>

{#if items.length && items[0]}

  <h3>{title}</h3>

  <div class="flex gap-2 bg-pink-100 rounded-lg p-2">
    
    {#if linkify}

      {#each items as item, i (i) }
        <a class="border-neutral leading-5 border-b-2 text-neutral font-bold" href="{item}">{item}</a>
      {/each}

    {:else}

      {items.join(', ')}

    {/if}

  </div>

{/if}