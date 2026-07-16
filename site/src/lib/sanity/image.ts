import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from '@sanity/types';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

/** Builds a Sanity CDN image URL builder from an `imageWithAlt` field value. */
export function urlFor(source: Image) {
	return builder.image(source);
}
