/**
 * donate-amount.js
 * Amount picker for the Modem Pay form in OnlineGiving.astro.
 *
 * Presets and the custom field are deliberately not named inputs — if both
 * were called "amount" the browser would submit both and Modem Pay would get
 * an ambiguous pair. Instead they write into one hidden "amount" field, so
 * exactly one value is ever posted.
 *
 * Blocks submission below the minimum rather than letting Modem Pay reject it,
 * which would cost the donor a page load and probably the donation.
 */

document.querySelectorAll('form[data-donate-form]').forEach((form) => {
	const amountField = form.querySelector('[data-amount-field]');
	const customInput = form.querySelector('[data-custom-amount]');
	const statusEl = form.querySelector('[data-form-status]');
	const presetButtons = form.querySelectorAll('[data-amount]');
	const min = Number(form.dataset.min) || 10;

	const setStatus = (message) => {
		if (!statusEl) return;
		statusEl.textContent = message ?? '';
		statusEl.classList.toggle('hidden', !message);
		statusEl.classList.toggle('text-red-600', Boolean(message));
	};

	const selectPreset = (button) => {
		presetButtons.forEach((b) =>
			b.setAttribute('aria-pressed', String(b === button)),
		);
		amountField.value = button ? button.dataset.amount : '';
	};

	presetButtons.forEach((button) => {
		button.addEventListener('click', () => {
			selectPreset(button);
			if (customInput) customInput.value = '';
			setStatus(null);
		});
	});

	customInput?.addEventListener('input', () => {
		// Typing a custom amount supersedes any chosen preset.
		selectPreset(null);
		amountField.value = customInput.value.trim();
		setStatus(null);
	});

	form.addEventListener('submit', (e) => {
		const amount = Number(amountField.value);

		if (!amountField.value || Number.isNaN(amount)) {
			e.preventDefault();
			setStatus('Please choose an amount or enter your own.');
			return;
		}

		if (amount < min) {
			e.preventDefault();
			setStatus(`The smallest donation we can process is D${min}.`);
			return;
		}

		// Modem Pay takes whole dalasi; rounding here keeps the donor from
		// being bounced off the checkout page for a stray decimal.
		amountField.value = String(Math.round(amount));
		setStatus(null);
	});
});
