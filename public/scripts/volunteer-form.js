/**
 * volunteer-form.js
 * Handles client-side submission of the Get Involved volunteer form via
 * Web3Forms (https://web3forms.com) — a free, static-site-friendly form
 * backend. No server or backend of our own needed.
 */

document
	.getElementById('volunteer-form')
	?.addEventListener('submit', async (e) => {
		e.preventDefault();

		const form = e.target;
		const statusEl = document.getElementById('volunteer-form-status');
		const submitBtn = form.querySelector('button[type="submit"]');
		const originalLabel = submitBtn.textContent;

		const successMessage =
			form.dataset.successMessage ||
			'Thank you! Your application has been received.';
		const errorMessage =
			form.dataset.errorMessage ||
			'Something went wrong. Please try again.';

		submitBtn.disabled = true;
		submitBtn.textContent = 'Sending...';

		try {
			const formData = new FormData(form);
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: formData,
			});
			const result = await response.json();

			statusEl.classList.remove(
				'hidden',
				'text-green-700',
				'text-red-600',
			);

			if (result.success) {
				statusEl.textContent = successMessage;
				statusEl.classList.add('text-green-700');
				form.reset();
			} else {
				statusEl.textContent = errorMessage;
				statusEl.classList.add('text-red-600');
			}
		} catch (err) {
			statusEl.classList.remove('hidden');
			statusEl.classList.add('text-red-600');
			statusEl.textContent = errorMessage;
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = originalLabel;
		}
	});
