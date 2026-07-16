/**
 * validate.ts
 * Shared guards for build-time data integrity checks — routing (duplicate
 * slugs) and optional-array rendering. Sanity's own schema validation
 * (required fields, reference integrity) now covers what used to be
 * hand-rolled JSON shape/category guards here.
 */

/**
 * True when `item[field]` is an array with at least one entry — use this to
 * guard any `.map()` over an optional/variable-shape JSON field (e.g.
 * article.content) before it renders, instead of assuming the field exists.
 */
export function hasNonEmptyArrayField(
	item: Record<string, unknown>,
	field: string,
): boolean {
	const value = item[field];
	return Array.isArray(value) && value.length > 0;
}

/**
 * Returns every value in `items` that appears more than once. Used to catch
 * duplicate slugs in projects.json/news.json — a duplicate slug makes
 * getStaticPaths() generate two routes for the same URL, and Astro silently
 * keeps only the first and drops the second's content with no build failure,
 * so this must be checked explicitly and turned into a real (loud) error.
 */
export function findDuplicates(items: string[]): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const item of items) {
		if (seen.has(item)) duplicates.add(item);
		seen.add(item);
	}
	return [...duplicates];
}
