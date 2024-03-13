import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { formSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';
import { getLeiturasbyDate, getSensores } from '$lib/db/';
import { parseDateTime } from '@internationalized/date';

function nextMultipleOf5(number: number) {
	return Math.ceil(number / 5) * 5;
}

export const load: PageServerLoad = async ({ cookies }) => {
	if (!cookies.get('sensores')) {
		const sensores = await getSensores();
		cookies.set('sensores', JSON.stringify(sensores), { path: '/', maxAge: 31536000 });
	}
	return {
		form: await superValidate(zod(formSchema)),
		sensores: JSON.parse(cookies.get('sensores') || '[]')
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const start = parseDateTime(form.data.date)
			.set({
				hour: 0,
				minute: 0
			})
			.toDate('America/Sao_Paulo');

		const end = parseDateTime(form.data.date)
			.set({
				hour: 23,
				minute: 59
			})
			.toDate('America/Sao_Paulo');

		const leituras = await getLeiturasbyDate(start, end);

		const resultArray: SensorData[] = [];

		let maxY = 0;

		leituras.forEach((leitura) => {
			const index = resultArray.findIndex((result) => {
				return result.timestamp.getTime() === leitura.timestamp.getTime();
			});

			Object.values(leitura.data).forEach((value) => {
				if (value > maxY) {
					maxY = value;
				}
			});

			if (index === -1) {
				resultArray.push({
					timestamp: leitura.timestamp,
					data: {
						[leitura.sensorId]: leitura.data
					}
				});
			} else {
				resultArray[index].data[leitura.sensorId] = leitura.data;
			}
		});

		switch (form.data.type) {
			case 'grafico':
				return message(form, {
					status: 200,
					leituras: resultArray,
					maxYdomain: nextMultipleOf5(maxY)
				});
			case 'csv':
			case 'json':
		}
	}
};
