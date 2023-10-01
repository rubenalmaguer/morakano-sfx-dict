/* export const csr = false; */
import type { PageLoad } from "./$types";
import { getDocCount, getDocBatch } from "$lib/firebase-pagination-loader";
import { error } from "@sveltejs/kit";

export const load = (async ({ url }) => {
  const DOCS_PER_PAGE = 3;
  const totalDocs = await getDocCount();
  if (!totalDocs) {
    return error(404, "No entries found.");
  }

  let direction = "FIRST";
  if (url.searchParams.has("before")) direction = "BEFORE";
  if (url.searchParams.has("after")) direction = "AFTER";
  if (url.searchParams.has("last")) direction = "LAST";

  const cutoffWord =
    url.searchParams.get("before") ?? url.searchParams.get("after") ?? null;

  return {
    /*  documentCount: await getDocCount(), */
    documents: await getDocBatch(direction, cutoffWord, DOCS_PER_PAGE),
    direction: direction,
    entriesPerPage: DOCS_PER_PAGE,
  };
}) satisfies PageLoad;
