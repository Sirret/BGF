/**
 * Registers (or updates, if already created) a Sanity webhook that fires a
 * GitHub repository_dispatch event on every publish, which re-triggers the
 * site's deploy workflow (see .github/workflows/deploy.yml's
 * `repository_dispatch: types: [sanity-content-published]` trigger).
 *
 * The Sanity CLI's `sanity hooks create` is interactive-only, so this uses
 * the Webhooks HTTP API directly: https://www.sanity.io/docs/http-reference/webhooks
 *
 * Requires SANITY_ADMIN_TOKEN (Administrator role — webhook management needs
 * the sanity.project.webhooks grant, which the Editor-level SANITY_API_TOKEN
 * used by seed.ts does not have) and GITHUB_DISPATCH_TOKEN (a GitHub classic
 * PAT, "public_repo" scope) in studio/.env — see .env.example.
 * Run with: npm run setup-webhook (from studio/).
 */
import 'dotenv/config'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const sanityToken = process.env.SANITY_ADMIN_TOKEN
const githubToken = process.env.GITHUB_DISPATCH_TOKEN

const GITHUB_OWNER = 'Sirret'
const GITHUB_REPO = 'BGF'
const DISPATCH_EVENT_TYPE = 'sanity-content-published'
const WEBHOOK_NAME = 'Trigger site rebuild'

if (!projectId || !dataset) {
	throw new Error('SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET missing — check studio/.env')
}
if (!sanityToken) {
	throw new Error(
		'SANITY_ADMIN_TOKEN missing from studio/.env. Generate an Administrator-permission ' +
			'token at sanity.io/manage → project → API → Tokens (webhook management needs ' +
			'this specific grant — the Editor-level SANITY_API_TOKEN is not enough), then add ' +
			'SANITY_ADMIN_TOKEN=<token> to studio/.env (already gitignored).',
	)
}
if (!githubToken) {
	throw new Error(
		'GITHUB_DISPATCH_TOKEN missing from studio/.env. Generate a classic PAT with the ' +
			'"public_repo" scope at https://github.com/settings/tokens, then add ' +
			'GITHUB_DISPATCH_TOKEN=<token> to studio/.env (already gitignored).',
	)
}

const hooksBaseUrl = `https://${projectId}.api.sanity.io/v2021-03-25/hooks/projects/${projectId}`

async function findExistingHookId(): Promise<string | undefined> {
	const res = await fetch(hooksBaseUrl, {
		headers: { Authorization: `Bearer ${sanityToken}` },
	})
	if (!res.ok) throw new Error(`Failed to list webhooks: ${res.status} ${await res.text()}`)
	const hooks = (await res.json()) as Array<{ id: string; name: string }>
	return hooks.find((h) => h.name === WEBHOOK_NAME)?.id
}

async function main() {
	const webhookPayload = {
		type: 'document',
		name: WEBHOOK_NAME,
		description: 'Fires GitHub repository_dispatch on publish, re-triggering the site deploy workflow.',
		url: `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
		dataset,
		rule: {
			on: ['create', 'update', 'delete'],
			// Static payload — GitHub's dispatches API only needs event_type; the
			// actual document that changed is irrelevant since the site rebuild
			// re-fetches everything from Sanity fresh anyway.
			projection: `{"event_type": "${DISPATCH_EVENT_TYPE}"}`,
		},
		apiVersion: 'v2021-03-25',
		httpMethod: 'POST',
		headers: {
			Authorization: `Bearer ${githubToken}`,
			Accept: 'application/vnd.github+json',
		},
		isDisabledByUser: false,
	}

	const existingId = await findExistingHookId()
	const url = existingId ? `${hooksBaseUrl}/${existingId}` : hooksBaseUrl
	// The update endpoint only accepts { isDisabledByUser }, so a change to
	// anything else (URL, token, rule) has to go through delete + recreate.
	if (existingId) {
		console.log(`Existing webhook "${WEBHOOK_NAME}" found (${existingId}) — deleting and recreating...`)
		const delRes = await fetch(url, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${sanityToken}` },
		})
		if (!delRes.ok) throw new Error(`Failed to delete existing webhook: ${delRes.status} ${await delRes.text()}`)
	}

	const createRes = await fetch(hooksBaseUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${sanityToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(webhookPayload),
	})
	if (!createRes.ok) throw new Error(`Failed to create webhook: ${createRes.status} ${await createRes.text()}`)
	const created = await createRes.json()
	console.log('Webhook created:', created)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
