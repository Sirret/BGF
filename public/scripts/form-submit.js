/**
 * form-submit.js
 * Generic submit handler for any Web3Forms-powered form on the page.
 * Shared by VolunteerForm.astro and PartnershipSection.astro — any future
 * form (e.g. a Phase 9 Contact page) can opt in with zero new JS by adding
 * the same three data attributes.
 *
 * Usage on a <form>:
 *   data-web3form                — marks the form for this handler
 *   data-success-message="..."   — shown on successful submission
 *   data-error-message="..."     — shown on failure
 * Plus a status element inside the form: <p data-form-status></p>
 *
 * Loaded once per page (not once per form component) — attaching this
 * script more than once would bind duplicate listeners and double-submit
 * every form on the page.
 */

document.querySelectorAll('form[data-web3form]').forEach((form) => {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const statusEl = form.querySelector('[data-form-status]');
		const submitBtn = form.querySelector('button[type="submit"]');
		const originalLabel = submitBtn ? submitBtn.textContent : null;

		const successMessage =
			form.dataset.successMessage ||
			'Thank you! Your message has been received.';
		const errorMessage =
			form.dataset.errorMessage ||
			'Something went wrong. Please try again.';

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';
		}

		try {
			const formData = new FormData(form);
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: formData,
			});
			const result = await response.json();

			if (statusEl) {
				statusEl.classList.remove(
					'hidden',
					'text-green-700',
					'text-red-600',
				);
				statusEl.textContent = result.success
					? successMessage
					: errorMessage;
				statusEl.classList.add(
					result.success ? 'text-green-700' : 'text-red-600',
				);
			}

			if (result.success) form.reset();
		} catch (err) {
			if (statusEl) {
				statusEl.classList.remove('hidden');
				statusEl.classList.add('text-red-600');
				statusEl.textContent = errorMessage;
			}
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = originalLabel;
			}
		}
	});
});
