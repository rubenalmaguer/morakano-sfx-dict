import { doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase';

export default async (word: string) => {
  const uniqueWordsRef = doc(db,'uniqueWords', word);
  const snapshot = await getDoc(uniqueWordsRef);
  const data = snapshot.data();

  // TODO: return whole data as-is. Make more general (take collection name as param). Move to $lib.
  return   {
      word: word,
        tags: data?.tags ?? '',
        definitions: data?.definitions ?? [],
        variants: data?.variants ?? '',
        similars: data?.similars ?? '',
        translations: data?.translations ?? '',
        imageInfo: {
          imageURL: data?.imageInfo?.imageURL ?? '',
          sourceURL: data?.imageInfo?.sourceUrl ?? '',
          sourceEpisode: data?.imageInfo?.sourceEpisode ?? '',
          sourceTitle: data?.imageInfo?.sourceTitle ?? '',
          sourcePlatform: data?.imageInfo?.sourcePlatform ?? ''
        }
    };
};