import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';
import { formSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';
import { getLeiturasbyDate, getSensores } from '$lib/db/';
import { parseDateTime } from '@internationalized/date';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			console.log(form);
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
		const sensores = await getSensores();

		type ResultType = {
			timestamp: Date;
			data: {
				[sensorId: string]: {
					[key: string]: number;
				};
			};
		};

		const resultArray: ResultType[] = [];

		leituras.forEach((leitura) => {
			const index = resultArray.findIndex((result) => {
				return result.timestamp.getTime() === leitura.timestamp.getTime();
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

		return message(form, { status: 200, leituras: resultArray, sensores });
	}
};
