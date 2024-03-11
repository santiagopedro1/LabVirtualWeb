import { and, gte, lte } from 'drizzle-orm';

import { db } from './client';
import { sensorData, sensors } from './schema';

export const getLeiturasbyDate = async (startDate: Date, endDate: Date) => {
	return await db
		.select({
			sensorId: sensorData.sensorId,
			timestamp: sensorData.timestamp,
			data: sensorData.data
		})
		.from(sensorData)
		.where(and(lte(sensorData.timestamp, endDate), gte(sensorData.timestamp, startDate)));
};

export const getSensores = async () => {
	return await db.select().from(sensors);
};

export { db } from './client';
export * from './schema';
