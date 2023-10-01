import {
  collection,
  getCountFromServer,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  limitToLast,
  getDocs,
} from "firebase/firestore";
import { db } from "$lib/firebase";

import type { DocumentData } from "firebase/firestore";

export async function getDocCount() {
  try {
    const collectionRef = collection(db, "uniqueWords");
    const snapshot = await getCountFromServer(collectionRef);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting document count:", error);
    return 0;
  }
}

export async function getDocBatch(
  direction: string,
  cutoffWord: string | null,
  docsPerPage: number
) {
  let q = null;

  switch (direction) {
    case "BEFORE":
      q = query(
        collection(db, "uniqueWords"),
        orderBy("word"),
        endAt(cutoffWord),
        limitToLast(docsPerPage + 1)
      );
      break;

    case "AFTER":
      q = query(
        collection(db, "uniqueWords"),
        orderBy("word"),
        startAt(cutoffWord),
        limit(docsPerPage + 1)
      );
      break;

    case "LAST":
      q = query(
        collection(db, "uniqueWords"),
        orderBy("word", "desc"),
        limit(docsPerPage)
      );
      break;

    case "FIRST":
    default:
      q = query(
        collection(db, "uniqueWords"),
        orderBy("word"),
        limit(docsPerPage)
      );
      break;
  }

  try {
    const querySnapshot = await getDocs(q);

    let result: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      const paddedData = {
        word: docData.word,
        tags: docData?.tags ?? "",
        definitions: docData?.definitions ?? [],
        variants: docData?.variants ?? "",
        similars: docData?.similars ?? "",
        translations: docData?.translations ?? "",
        imageInfo: {
          imageURL: docData?.imageInfo?.imageURL ?? "",
          sourceURL: docData?.imageInfo?.sourceUrl ?? "",
          sourceEpisode: docData?.imageInfo?.sourceEpisode ?? "",
          sourceTitle: docData?.imageInfo?.sourceTitle ?? "",
          sourcePlatform: docData?.imageInfo?.sourcePlatform ?? "",
        },
      };
      result.push(paddedData);
    });

    if (direction === "LAST") result.reverse();

    return result;
  } catch (error) {
    console.error("Error executing Firestore query:", error);
  }
}
