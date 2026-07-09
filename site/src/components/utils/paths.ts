/**
 * paths.ts
 * withBase() prepends the site's configured `base` (see astro.config.mjs)
 * to any root-relative internal path — public/ assets (images, scripts)
 * and internal route hrefs.
 *
 * Leaves untouched:
 *   - external URLs (http://, https://)
 *   - protocol links (mailto:, tel:)
 *   - undefined/empty values
 *
 * Needed because GitHub Pages serves this project from a subpath
 * (https://sirret.github.io/BGF/), so every hardcoded "/images/...",
 * "/scripts/...", or "/about" style path must be prefixed with that
 * subpath — in both dev and production, since base applies everywhere.
 */
export function withBase(path?: string): string | undefined {
	if (!path) return path;
	if (!path.startsWith('/')) return path; // external URL, mailto:, tel:, etc.

	const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/BGF' in prod, '' at root
	return `${base}${path}`;
}