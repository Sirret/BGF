// Mirrors the keys in site/src/components/utils/icons.ts. The two apps are
// separate npm packages with no shared module, so this list has to be kept
// in sync by hand — icons.ts's getIcon() throws at build time on an unknown
// name, which stays the defense-in-depth backstop if this list drifts.
export const ICON_OPTIONS = [
	'graduation-cap',
	'heart',
	'building',
	'user-group',
	'chat-bubble',
	'flag',
	'star',
	'shield-check',
	'bolt',
	'eye',
];
