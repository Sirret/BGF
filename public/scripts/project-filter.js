/**
 * project-filter.js
 * Category filter behavior for ProjectGrid.astro on the Projects page.
 * Externalized from an inline <script> tag so it can be allowed under a
 * strict CSP (script-src 'self') without any 'unsafe-inline' exception.
 *
 * Also supports deep-linking a filter via URL hash (e.g. /projects#education
 * from the homepage Focus Area cards) — the hash is matched against each
 * button's data-filter with startsWith (case-insensitive) since some
 * categories are multi-word ("Community Development", "Charity & Outreach")
 * while their anchors use a short single-word slug.
 */

const buttons = document.querySelectorAll('.project-filter-btn');
const cards = document.querySelectorAll('.project-card');
const emptyState = document.getElementById('project-empty-state');

function setActiveButton(target) {
	buttons.forEach((btn) => {
		const isActive = btn === target;
		btn.setAttribute('aria-pressed', String(isActive));
		btn.classList.toggle('bg-primary', isActive);
		btn.classList.toggle('text-white', isActive);
		btn.classList.toggle('text-primary', !isActive);
	});
}

function applyFilter(filter) {
	let visibleCount = 0;

	cards.forEach((card) => {
		const matches = filter === 'all' || card.dataset.category === filter;
		card.classList.toggle('hidden', !matches);
		if (matches) visibleCount++;
	});

	emptyState?.classList.toggle('hidden', visibleCount > 0);
}

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		const filter = button.dataset.filter ?? 'all';
		setActiveButton(button);
		applyFilter(filter);
	});
});

// Deep-link support: /projects#education pre-selects the matching filter.
const hash = decodeURIComponent(location.hash.slice(1)).toLowerCase();
if (hash) {
	const matchedButton = [...buttons].find((btn) =>
		btn.dataset.filter?.toLowerCase().startsWith(hash),
	);
	if (matchedButton) {
		setActiveButton(matchedButton);
		applyFilter(matchedButton.dataset.filter ?? 'all');
	}
}
