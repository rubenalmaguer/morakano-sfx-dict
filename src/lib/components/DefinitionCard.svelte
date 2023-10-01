<script lang="ts">
  // @ts-ignore
  import kroman from 'kroman';
  import ImageWithModal from '$lib/components/ImageWithModal.svelte';
  import CompactList from '$lib/components/CompactList.svelte';
  import AuthCheck from './AuthCheck.svelte';

  export let data: DictionaryEntry;

  // Reactive for client-side navigation

  $: romanized = kroman.parse(data.word).replaceAll('-','·');

  $: ({ tags, variants, translations, similars } = explodeCSVs(data));

  $: definitions = data.definitions.map(destringifyDefinition).filter(def => !!def.sense);

  function destringifyDefinition(str: string) {
    const lines = str.split('\n*');
    let sense = lines.shift();
    let examples = lines;

    return {
      sense,
      examples
    }
  }

  function explodeCSVs(data: any) {
    const rx = /[\s,]+/;
    return {
      tags: data.tags.split(rx),
      variants: data.variants.split(rx),
      translations: data.translations.split(rx),
      similars: data.similars.split(rx),
    }
  }

  function chipColor(tag: string) {

    const coloredCategories: any = {
      '의성어': 'badge-neutral',
      '의태어': 'badge-accent',
      '19+': 'badge-primary'
    };

    if (Object.keys(coloredCategories).includes(tag)) {
      return coloredCategories[tag];
    }

    return 'bg-pink-50'
  };

  function formatExample(example: string) {

    const variantsWithPlusSigns = [data.word, ...variants].map(s => s.split('').join('+'));
    const variantsButLongestFirst = variantsWithPlusSigns.sort((a, b) => b.length - a.length);
    const rx = new RegExp(`(${variantsButLongestFirst.join('|')})`, 'g');

    return example.replace(rx, '<b>$1</b>');
  }

</script>

<article class="card w-full md:w-[640px] bg-base-100 shadow-xl">
  <main class="card-body">
    <section>

      <ImageWithModal word={ data.word } imageInfo={ data.imageInfo } />
    
      <h2 class="card-title text-2xl">

        <!-- Title -->
        {data.word}

        <!-- Romanization -->
        <span class="text-base">/{romanized}/</span>
      </h2>
    
      <!-- Chips -->
      {#if tags.length && tags[0] }
        <div class="flex gap-1 mt-1">
          <!-- ALWAYS use keyed each blocks for proper client-side navigtion https://github.com/sveltejs/kit/issues/8272 -->
          {#each tags as tag, i (i)}
            <span class="badge {chipColor(tag)}">{tag}</span>
          {/each}
        </div>
      {/if}

      <!-- Definitions -->
      <ol class="my-4 list-inside list-decimal">
        {#each definitions as definition, i (i)}

          <!-- Definition -->
          <li>{definition.sense}</li>

          <!-- Examples -->
          {#each definition.examples as example, i (i)}
          <blockquote class="ml-4 pl-2 mb-2 border-l-2 border-base-300 italic">
            {@html formatExample(example)}
          </blockquote>
          {/each}

        {/each}
      </ol>

    </section>

    <section class="flex flex-col gap-2">

      <CompactList title="Common translations:" items={translations}/>

      <CompactList title="Derived forms:" items={variants}/>

      <CompactList title="Similar words:" items={similars} linkify/>

    </section>

    <AuthCheck simple>
      <div class="card-actions justify-end">
        <a href={`/edit?word=${data.word}`} class="btn btn-primary">Edit</a>
      </div>
    </AuthCheck>

  </main>
</article>


<style>
  .badge {
    word-break: keep-all;
  }
</style>