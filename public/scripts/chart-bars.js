/**
 * chart-bars.js
 * Sets height + opacity on StatBlock mini bar-chart bars via the CSSOM
 * (element.style.property = value), not via HTML style="" attributes.
 *
 * Why: the CSSOM API is not restricted by Content-Security-Policy's
 * style-src directive, unlike inline style="" attributes or <style> content
 * injected via innerHTML. This lets a strict CSP (style-src 'self', no
 * 'unsafe-inline') work with zero exceptions.
 */

document.querySelectorAll('.chart-bar[data-value]').forEach((bar) => {
	const value = Number(bar.getAttribute('data-value')) || 0;
	bar.style.height = `${value}%`;
	bar.style.opacity = String(0.3 + (value / 100) * 0.7);
});
