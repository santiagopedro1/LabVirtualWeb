import { z } from 'zod';

export const formSchema = z.object({
	date: z.string().refine((v) => v, { message: 'Escolha uma data' }),
	type: z.enum(['grafico', 'csv', 'json'])
});

export type LeiturasFormSchema = typeof formSchema;
