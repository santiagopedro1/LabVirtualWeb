import { and, eq, gte, lte } from 'drizzle-orm';

import { db } from './client';
import { sensorData, sensors, sensorTypes } from './schema';

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
	return await db
		.select({
			internalId: sensors.sensorId,
			sensorName: sensorTypes.name,
			supportedAtr: sensorTypes.dataRead,
			desc: sensors.desc
		})
		.from(sensors)
		.innerJoin(sensorTypes, eq(sensors.sensorTypeId, sensorTypes.sensorId));
};

export { db } from './client';
export * from './schema';
