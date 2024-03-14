import type { PageServerLoad } from './$types';
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
		sensores: JSON.parse(cookies.get('sensores') || '[]')
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const date = String(formData.get('date'));
		const type = String(formData.get('type'));

		if (!date || !type) return fail(400, { message: 'Foda' });

		const start = parseDateTime(date)
			.set({
				hour: 0,
				minute: 0
			})
			.toDate('America/Sao_Paulo');
		const end = parseDateTime(date)
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

		switch (type) {
			case 'grafico':
				return {
					type: type,
					leituras: resultArray,
					maxYdomain: nextMultipleOf5(maxY)
				};
			case 'csv':
				return {
					type: type,
					leituras: arrayToCSV(resultArray)
				};
			case 'json':
				// rename the keys from data to sensor{index + 1}
				const json = resultArray.map((leitura) => {
					const sensorData: any = {};
					Object.keys(leitura.data).forEach((key, index) => {
						sensorData[`sensor${index + 1}`] = leitura.data[key];
					});
					return {
						timestamp: leitura.timestamp,
						dados: sensorData
					};
				});
				return {
					type: type,
					leituras: json
				};
		}
	}
};

function arrayToCSV(data: SensorData[]) {
	// Header
	let csv = 'timestamp,';
	const sensorIds: Set<string> = new Set();

	// Collect all unique sensorIds
	data.forEach((sensorData) => {
		Object.keys(sensorData.data).forEach((sensorId) => {
			sensorIds.add(sensorId);
		});
	});

	// Add headers prefixed by sensorId
	let i = 0;
	sensorIds.forEach((sensorId) => {
		Object.keys(data[0].data[sensorId]).forEach((key) => {
			csv += `sensor${i + 1}_${key},`;
		});
		++i;
	});
	csv = csv.slice(0, -1); // Remove trailing comma
	csv += '\n';

	// Data
	data.forEach((sensorData) => {
		csv += `${sensorData.timestamp.toISOString()},`;
		sensorIds.forEach((sensorId) => {
			const sensorDataObj = sensorData.data[sensorId];
			Object.keys(sensorDataObj).forEach((key) => {
				csv += `${sensorDataObj[key]},`;
			});
		});
		csv = csv.slice(0, -1); // Remove trailing comma
		csv += '\n';
	});

	return csv;
}
