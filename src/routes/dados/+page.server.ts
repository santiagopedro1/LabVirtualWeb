import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		console.log(await request.formData());
	}
} as Actions;
