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
 *   data-fallback-email="..."    — optional; shown alongside the error
 *                                  message so a visitor isn't left with no
 *                                  way to reach out if the submission fails
 * Plus a status element inside the form: <p data-form-status></p>
 *
 * Loaded once per page (not once per form component) — attaching this
 * script more than once would bind duplicate listeners and double-submit
 * every form on the page.
 *
 * Every failure path (rejected by Web3Forms, or the fetch/parse throwing)
 * logs to the console — this is the only lead-capture path this site has
 * (donations/volunteering/partnerships all funnel through these forms), so
 * a failure here should never be invisible.
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
		const fallbackEmail = form.dataset.fallbackEmail;
		const errorMessage =
			(form.dataset.errorMessage ||
				'Something went wrong. Please try again.') +
			(fallbackEmail ? ` You can also reach us directly at ${fallbackEmail}.` : '');

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

			if (!result.success) {
				console.error('[form-submit] Web3Forms rejected submission:', result);
			}

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
			console.error('[form-submit] submission failed:', err);
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
