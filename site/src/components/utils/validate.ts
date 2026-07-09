/**
 * validate.ts
 * Shared guard for JSON-sourced data records (projects.json, news.json,
 * gallery.json, etc.) — drops stray/malformed entries before they're
 * rendered or turned into a static route, instead of each grid/detail
 * page re-implementing its own ad-hoc filter.
 */

// Bound is `object`, not `Record<string, unknown>` — the latter requires an
// explicit string index signature, which plain `interface`/`type` shapes
// (Project, Photo, Article, future Sanity query-result types, ...) never
// have. `object` accepts those directly; do not tighten this back to
// `Record<string, unknown>`, every closed interface call site would fail to
// compile again.
export function hasStringFields<T extends object>(
	item: unknown,
	fields: (keyof T)[],
): item is T {
	if (!item || typeof item !== 'object') return false;
	return fields.every((field) => typeof (item as Record<string, unknown>)[field as string] === 'string');
}

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

/**
 * Throws if any value in `categoryValues` isn't in `knownNames` (categories.json).
 * Catches a typo'd/renamed category before it silently becomes its own orphan
 * filter button with no warning.
 */
export function assertKnownCategories(
	categoryValues: string[],
	knownNames: string[],
	sourceLabel: string,
): void {
	const unknown = [...new Set(categoryValues)].filter((c) => !knownNames.includes(c));
	if (unknown.length > 0) {
		throw new Error(
			`${sourceLabel} uses categor${unknown.length === 1 ? 'y' : 'ies'} not listed in categories.json: ${unknown.join(', ')}. Add ${unknown.length === 1 ? 'it' : 'them'} to categories.json or fix the typo.`,
		);
	}
}
