import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import loader from '$lib/firebase-word-loader';

export const load = (async ({ url }) => {
    const word = url.searchParams.get('word');

    if (!word) throw error(404, 'Page not found :(');

    const data = await loader(word);

    return {
      word, ...data.imageInfo
    }

}) satisfies PageLoad;