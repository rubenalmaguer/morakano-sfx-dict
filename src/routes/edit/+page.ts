import type { PageLoad } from "./$types";
import loader from "$lib/firebase-word-loader";
import { error } from "@sveltejs/kit";

export const load = (async ({ url }) => {
  const word = url.searchParams.get("word");

  if (!word) throw error(404, "Page not found :(");

  return await loader(word);
}) satisfies PageLoad;
