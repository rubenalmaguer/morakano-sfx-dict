import type { PageLoad } from './$types';
import loader from '$lib/firebase-word-loader'

export const load = (async ({ params }) => {

  return await loader(params.word)

}) satisfies PageLoad;