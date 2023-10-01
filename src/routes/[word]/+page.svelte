<script lang="ts">
    import type { PageData } from './$types';
    import DefinitionCard from '$lib/components/DefinitionCard.svelte';
    export let data: PageData;
    $: (data = data); // https://stackoverflow.com/questions/76680583/sveltekit-navigation-issue-client-side-change-detection-not-working
</script>

<div class="py-8 px-4 md:px-8 flex flex-col gap-8 items-center">
    {#if data.definitions.length}

        <DefinitionCard bind:data/>

    {:else}

        <h2 class="text-lg">"<b>{data.word}</b>" was not found.</h2>
        <img class="w-60 bg-base-100 p-4 shadow-lg" src="/art/oops.png" alt="Oops!">

        {#if /^[가-힣]+$/.test(data.word) }
            <a href="edit?word={data.word}" class="btn">Create definition</a>
        {/if}

    {/if}
</div>