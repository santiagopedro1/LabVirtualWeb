import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	return {
		theme: cookies.get('theme')
	};
}) satisfies LayoutServerLoad;
