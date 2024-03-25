<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { CalendarIcon, ChevronDown } from 'lucide-svelte';

	import { mediaQuery } from 'svelte-legos';

	export let chartState: Boolean | 'loading' = false;

	let value: DateValue | undefined = undefined;
	let dateError = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long'
	});
</script>

<form
	method="POST"
	id="dados"
	class="flex items-center justify-center gap-8 {!$isDesktop && 'flex-col'}"
	use:enhance={({ submitter, formData, cancel }) => {
		if (formData.get('date') === 'undefined') {
			dateError = true;
			setTimeout(() => {
				dateError = false;
			}, 2000);
			return cancel();
		}
		if (submitter) {
			if (submitter.id === 'grafico') chartState = 'loading';
			formData.append('type', submitter.id);
		}
		return async ({ result, update }) => {
			update();
			if (result.type === 'success' && result.data) {
				let blob = new Blob();
				switch (result.data.type) {
					case 'grafico':
						chartState = true;
						break;
					case 'csv':
						blob = new Blob([String(result.data.leituras)], {
							type: `text/${result.data.type}`
						});
						break;
					case 'json':
						blob = new Blob([JSON.stringify(result.data.leituras, null, 4)], {
							type: `application/${result.data.type}`
						});
						break;
				}
				if (result.data.type !== 'grafico') {
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `dados-${value?.toDate('America/Sao_Paulo').toLocaleDateString('pt-BR')}.${result.data.type}`;
					document.body.appendChild(a);
					a.click();
					a.remove();
				}
				value = undefined;
			}
		};
	}}
>
	<div class="flex flex-col gap-2">
		<Popover.Root>
			<Popover.Trigger
				asChild
				let:builder
			>
				<Button
					variant="outline"
					class="w-[280px] justify-start text-left font-normal transition-all
					{!value && 'text-muted-foreground'} {dateError && 'ring-2 ring-destructive'}"
					builders={[builder]}
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					{value ? df.format(value.toDate(getLocalTimeZone())) : 'Escolha uma data para consulta'}
				</Button>
			</Popover.Trigger>
			<Popover.Content
				class="w-auto p-0"
				align="start"
			>
				<Calendar
					bind:value
					placeholder={new CalendarDate(2022, 2, 11)}
					minValue={new CalendarDate(2022, 2, 11)}
					maxValue={new CalendarDate(2022, 10, 5)}
					locale="pt-BR"
				/>
			</Popover.Content>
			<input
				hidden
				{value}
				name="date"
			/>
		</Popover.Root>
	</div>

	<div class="flex gap-2">
		<Button
			type="submit"
			id="grafico"
		>
			Gráfico
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button class="flex gap-4">
					Download
					<ChevronDown size="16" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="p-0">
				<DropdownMenu.Item>
					<Button
						type="submit"
						id="csv"
						form="dados"
						variant="ghost"
						class="w-full rounded-md"
					>
						CSV
					</Button>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<Button
						type="submit"
						id="json"
						form="dados"
						variant="ghost"
						class="w-full rounded-md"
					>
						JSON
					</Button>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</form>
