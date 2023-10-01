import { db, storage } from "$lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const save = async (formData: any) => {
  const wordForId = formData.get("word") as string;
  const cleanData = sanitizeData(formData) as DictionaryEntry;
  try {
    await setDoc(doc(db, "uniqueWords", wordForId), cleanData, { merge: true });
  } catch (e) {
    throw e;
  }
};

export const destroy = async (formData: any) => {
  const wordForId = formData.get("word") as string;

  await deleteDoc(doc(db, "uniqueWords", wordForId));
};

export const saveImage = async (formData: any) => {
  const wordForId = formData.get("word") as string;
  const imageFile: any = formData.get("file");
  const imageName = imageFile.name as string;
  const imageBytes = new Uint8Array(await imageFile.arrayBuffer());
  let imageUrl = "";

  // Upload image (if changed)
  if (imageBytes.length) {
    const storageRef = ref(storage, `art/${imageName}`);
    const result = await uploadBytes(storageRef, imageBytes);
    imageUrl = await getDownloadURL(result.ref);
  }

  // Save image source data
  const data = {
    /* Nested, as it should not overwrite rest of document */
    imageInfo: {
      imageURL: imageUrl || formData.get("previousImageURL"),
      sourceUrl: formData.get("url"),
      sourceEpisode: formData.get("episode"),
      sourceTitle: formData.get("title"),
      sourcePlatform: formData.get("platform") ?? "",
    },
  };

  await setDoc(doc(db, "uniqueWords", wordForId), data, { merge: true });
};

function sanitizeData(formData: FormData) {
  const normalize = (value: any) => {
    if (value === null || value === undefined) return "";
    return value
      .toString()
      .trim()
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  };
  const cleanData = {
    word: formData.get("word"),
    tags: normalize(formData.get("tags")),
    definitions: [] as string[],
    variants: normalize(formData.get("variants")),
    similars: normalize(formData.get("similars")),
    translations: normalize(formData.get("translations")),
  };
  for (const [key, val] of formData.entries()) {
    if (key.startsWith("def") && val) {
      cleanData.definitions.push(val.toString());
    }
  }

  return cleanData;
}
