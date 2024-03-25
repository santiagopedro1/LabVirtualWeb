<script lang="ts">
	import LeiturasForm from './leituras-form.svelte';
	import type { ActionData, PageData } from './$types';
	import LineChart from '$lib/components/LineChart.svelte';

	export let data: PageData;
	export let form: ActionData;

	let leituras: SensorData[];
	let maxYdomain: number;
	$: if (form) {
		leituras = form.leituras as SensorData[];
		maxYdomain = form.maxYdomain as number;
	}

	let chartState: Boolean | 'loading' = false;
</script>

<svelte:head>
	<title>Dados - Labvirtual</title>
</svelte:head>

<LeiturasForm bind:chartState />

{#if chartState === 'loading'}
	<svg
		fill="none"
		class="h-32 w-32 animate-spin stroke-2"
		viewBox="0 0 32 32"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			clip-rule="evenodd"
			d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
			fill="currentColor"
			fill-rule="evenodd"
		/>
	</svg>
{:else if chartState === true && form?.type === 'grafico'}
	<LineChart
		{leituras}
		{maxYdomain}
		sensores={data.sensores}
	/>
{/if}
