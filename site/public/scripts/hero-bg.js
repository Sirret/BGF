/**
 * hero-bg.js
 * Sets background-image on hero sections via the CSSOM (element.style.property
 * = value), not via HTML style="" attributes — same CSP-safe pattern as
 * chart-bars.js (see that file's comment for why). Used by PageHero.astro,
 * ProjectDetailHero.astro, and NewsDetailHero.astro, whose background image
 * comes from a Sanity-resolved URL computed at build time and can't be a
 * pre-declared static CSS class the way purely static images can.
 */

document.querySelectorAll('[data-hero-bg-url]').forEach((el) => {
	el.style.backgroundImage = el.getAttribute('data-hero-bg-url');
});
