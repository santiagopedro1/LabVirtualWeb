<!-- <script lang="ts">
	import { enhance } from '$app/forms';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { ChevronDown } from 'lucide-svelte';

	let open = false;
	let chartState: Boolean | 'loading' = false;
</script>

<form
	method="POST"
	id="dados"
	use:enhance={({ formData, submitter }) => {
		formData.append('tipo', submitter?.id || 'grafico');
	}}
	class="flex gap-8"
>
	<Datepicker />
	<Button
		id="grafico"
		type="submit"
		on:click={() => (chartState = !chartState)}>Gráfico</Button
	>
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
		<Popover.Content class="grid w-max place-items-center gap-3">
			<Button
				id="csv"
				form="dados"
				type="submit"
				variant="ghost"
				on:click={() => (open = false)}>CSV</Button
			>
			<Button
				id="json"
				form="dados"
				type="submit"
				variant="ghost"
				on:click={() => (open = false)}>JSON</Button
			>
		</Popover.Content>
	</Popover.Root>
</form>

{#if chartState}
{/if} -->

<script lang="ts">
	import LeiturasForm from './leituras-form.svelte';
	import type { PageData } from './$types';
	import LineChart from '$lib/components/LineChart.svelte';

	export let data: PageData;
	let dados: any;
</script>

<svelte:head>
	<title>Dados - Labvirtual</title>
</svelte:head>

<LeiturasForm
	data={data.form}
	bind:dados
/>
{#if dados}
	<LineChart leituras={dados.leituras} sensores={data.sensores} maxYdomain={dados.maxYdomain} />
{/if}
