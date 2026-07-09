/**
 * dates.ts
 * Shared date handling for JSON-sourced `date` fields (projects.json,
 * news.json). Centralizes formatting/sorting so an invalid date string is
 * handled once, consistently, instead of each component's own
 * `new Date(x).toLocaleDateString(...)` silently rendering "Invalid Date"
 * or corrupting a sort with NaN.
 */

/** Formats a date string, or returns null if it isn't a valid date. */
export function formatDate(
	date: string | undefined,
	options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string | null {
	if (!date) return null;
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed.toLocaleDateString('en-US', options);
}

/** Timestamp for sorting; invalid/missing dates sort to the very end. */
export function toSortableTimestamp(date: string | undefined): number {
	if (!date) return 0;
	const parsed = new Date(date).getTime();
	return Number.isNaN(parsed) ? 0 : parsed;
}
