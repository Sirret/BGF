/**
 * project-filter.js
 * Category filter behavior for ProjectGrid.astro on the Projects page.
 * Externalized from an inline <script> tag so it can be allowed under a
 * strict CSP (script-src 'self') without any 'unsafe-inline' exception.
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
