/**
 * nav-toggle.js
 * Mobile menu open/close behavior for Navbar.astro.
 * Externalized from an inline <script> tag so it can be allowed under a
 * strict CSP (script-src 'self') without any 'unsafe-inline' exception.
 */

const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

toggle?.addEventListener('click', () => {
	const isOpen = !menu?.classList.contains('hidden');

	if (isOpen) {
		menu?.classList.add('hidden');
		iconOpen?.classList.remove('hidden');
		iconClose?.classList.add('hidden');
		toggle.setAttribute('aria-expanded', 'false');
	} else {
		menu?.classList.remove('hidden');
		iconOpen?.classList.add('hidden');
		iconClose?.classList.remove('hidden');
		toggle.setAttribute('aria-expanded', 'true');
	}
});

// Close menu when a link is clicked
menu?.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => {
		menu.classList.add('hidden');
		iconOpen?.classList.remove('hidden');
		iconClose?.classList.add('hidden');
		toggle?.setAttribute('aria-expanded', 'false');
	});
});
