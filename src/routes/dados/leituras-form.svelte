<script lang="ts">
	import { Calendar as CalendarIcon, ChevronDown } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { type LeiturasFormSchema, formSchema } from './schema';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/';
	import * as Popover from '$lib/components/ui/popover/';
	import { Calendar } from '$lib/components/ui/calendar/';
	import { Button } from '$lib/components/ui/button/';

	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		CalendarDate
	} from '@internationalized/date';

	export let data: SuperValidated<Infer<LeiturasFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, message } = form;

	export let dados = $message;
	$: if ($message) dados = $message;

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined = $formData.date ? parseDate($formData.date) : undefined;
	$: value = $formData.date ? parseDate($formData.date) : undefined;

	let placeholder: DateValue = new CalendarDate(2022, 2, 11);
	let open = false;
</script>

<form
	method="POST"
	id="dados"
	class="flex items-center justify-center gap-8"
	use:enhance
>
	<Form.Field
		{form}
		name="date"
		class="flex flex-col"
	>
		<Form.Control let:attrs>
			<Form.Label>Data para consulta</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					asChild
					let:builder
				>
					<Button
						variant="outline"
						class="w-[280px] justify-start text-left font-normal
							{!value && 'text-muted-foreground'}"
						builders={[builder]}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{value ? df.format(value.toDate(getLocalTimeZone())) : 'Escolha uma data'}
					</Button>
				</Popover.Trigger>
				<Popover.Content
					class="w-auto p-0"
					align="start"
				>
					<Calendar
						{value}
						bind:placeholder
						minValue={new CalendarDate(2022, 2, 11)}
						maxValue={new CalendarDate(2022, 10, 5)}
						locale="pt-BR"
						onValueChange={(v) => {
							if (v) {
								$formData.date = v.toString();
							} else {
								$formData.date = '';
							}
						}}
					/>
				</Popover.Content>
				<input
					hidden
					value={$formData.date}
					name={attrs.name}
				/>
			</Popover.Root>
		</Form.Control>
		<Form.FieldErrors class="h-5" />
	</Form.Field>

	<Form.Field
		{form}
		name="type"
	>
		<Form.Control let:attrs>
			<input
				hidden
				name={attrs.name}
				value={$formData.type}
			/>
		</Form.Control>
	</Form.Field>

	<div class="flex gap-2">
		<Form.Button id="grafico">Gráfico</Form.Button>
		<Popover.Root bind:open>
			<Popover.Trigger
				asChild
				let:builder
			>
				<Button
					builders={[builder]}
					class="flex justify-between gap-2"
				>
					Download
					<ChevronDown size="16" />
				</Button>
			</Popover.Trigger>
			<Popover.Content class="flex w-max flex-col items-center p-0">
				<Form.Button
					id="csv"
					form="dados"
					variant="ghost"
					size="lg"
					class="w-full"
					on:click={() => {
						open = false;
						$formData.type = 'csv';
						console.log($formData);
					}}>CSV</Form.Button
				>
				<Form.Button
					id="json"
					form="dados"
					variant="ghost"
					size="lg"
					class="w-full"
					on:click={() => {
						open = false;
						$formData.type = 'json';
						console.log($formData);
					}}>JSON</Form.Button
				>
			</Popover.Content>
		</Popover.Root>
	</div>
</form>
