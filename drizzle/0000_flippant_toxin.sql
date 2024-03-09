CREATE TABLE `leitura_sensor` (
	`id_leitura` text PRIMARY KEY NOT NULL,
	`id_sensor` text NOT NULL,
	`dados` text NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`id_sensor`) REFERENCES `sensor`(`id_sensor`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tipo_sensor` (
	`id_tipo` text PRIMARY KEY NOT NULL,
	`nome_tipo` text NOT NULL,
	`dados_suportados` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sensor` (
	`id_sensor` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`id_tipo` text NOT NULL,
	`descricao` text,
	FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_tipo`) REFERENCES `tipo_sensor`(`id_tipo`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuario` (
	`id_usuario` text PRIMARY KEY NOT NULL,
	`nome_usuario` text NOT NULL,
	`data_inicio` text NOT NULL
);
