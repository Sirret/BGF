/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
	/**
	 * Modem Pay publishable key (pk_test_… or pk_live_…). Read by
	 * OnlineGiving.astro, which derives the test vs live checkout endpoint from
	 * the prefix. The matching secret key is never used here — it needs a
	 * server, and this is a static build.
	 */
	readonly PUBLIC_MODEM_PAY_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
