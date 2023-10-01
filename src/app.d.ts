// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type ImageInfo = {
		imageURL: string,
		sourceURL: string,
		sourceEpisode: string,
		sourceTitle: string,
		sourcePlatform: string,
	}

	type DictionaryEntry = {
		word?: string,
		tags: string, /* csv */
		definitions: string[],
		variants: string, /* csv */
		similars: string, /* csv */
		translations: string, /* csv */
		imageInfo?: ImageInfo
	}

	interface ImageMetaByName {
		[name: string]: ImageMetadata
	}
}

export {};
