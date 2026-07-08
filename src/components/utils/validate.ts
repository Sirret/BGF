/**
 * validate.ts
 * Shared guard for JSON-sourced data records (projects.json, news.json,
 * gallery.json, etc.) — drops stray/malformed entries before they're
 * rendered or turned into a static route, instead of each grid/detail
 * page re-implementing its own ad-hoc filter.
 */

export function hasStringFields<T extends Record<string, unknown>>(
	item: unknown,
	fields: (keyof T)[],
): item is T {
	if (!item || typeof item !== 'object') return false;
	return fields.every((field) => typeof (item as Record<string, unknown>)[field as string] === 'string');
}
