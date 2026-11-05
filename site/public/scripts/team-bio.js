/**
 * team-bio.js
 * Collapses long bios in LeadershipTeam.astro behind a "Read more" toggle.
 * Bios that already fit stay fully open with no toggle. Without JavaScript,
 * every bio simply shows in full.
 */

const grid = document.querySelector('[data-team-grid]');
const cards = [...document.querySelectorAll('[data-team-bio]')].map((bio) => ({
	bio,
	toggle: bio.parentElement.querySelector('[data-team-bio-toggle]'),
	expanded: false,
}));

const measure = () => {
	cards.forEach((card) => {
		if (card.expanded) return;
		card.bio.dataset.collapsed = '';
		// Hiding only a line or two behind a toggle saves nothing, so show those in full.
		const lineHeight = parseFloat(getComputedStyle(card.bio.querySelector('p')).lineHeight);
		const fits = card.bio.scrollHeight - card.bio.clientHeight <= lineHeight * 2 + 1;
		if (fits) delete card.bio.dataset.collapsed;
		card.toggle.hidden = fits;
	});
};

cards.forEach((card) => {
	card.toggle.addEventListener('click', () => {
		card.expanded = !card.expanded;
		if (card.expanded) delete card.bio.dataset.collapsed;
		else card.bio.dataset.collapsed = '';
		card.toggle.textContent = card.expanded ? 'Show less' : 'Read more';
		card.toggle.setAttribute('aria-expanded', String(card.expanded));
		// Stops an open card stretching its neighbours into tall empty boxes.
		grid.classList.toggle('items-start', cards.some((c) => c.expanded));
	});
});

measure();
window.addEventListener('load', measure);
window.addEventListener('resize', measure);
