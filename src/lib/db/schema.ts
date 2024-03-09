import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('usuario', {
	userId: text('id_usuario')
		.primaryKey()
		.$defaultFn(() => createId()),
	username: text('nome_usuario').notNull(),
	startDate: text('start_date').notNull()
});

export const sensorTypes = sqliteTable('tipo_sensor', {
	sensorId: text('id_tipo')
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('nome_tipo').notNull(),
	dataRead: text('dados_suportados', { mode: 'json' }).$type<Array<string>>().notNull()
});

export const sensors = sqliteTable('sensor', {
	sensorId: text('id_sensor')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: integer('id_usuario')
		.references(() => users.userId)
		.notNull(),
	sensorTypeId: integer('id_tipo')
		.references(() => sensorTypes.sensorId)
		.notNull(),
	desc: text('descricao')
});

export const sensorData = sqliteTable('leitura_sensor', {
	dataId: text('id_leitura')
		.primaryKey()
		.$defaultFn(() => createId()),
	sensorId: integer('id_sensor')
		.references(() => sensors.sensorId)
		.notNull(),
	data: text('dados', { mode: 'json' })
		.$type<{
			[key: string]: number;
		}>()
		.notNull(),
	timestamp: integer('timestamp', { mode: 'timestamp' }).notNull()
});
