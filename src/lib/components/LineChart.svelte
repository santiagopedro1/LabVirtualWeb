<script lang="ts">
	import { Scale } from '@unovis/ts';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';

	import { leituras } from './data';

	type DataRecord = { x: number; y1: number; y2: number };
	export const data: DataRecord[] = leituras.map((d) => ({
		x: new Date(d.x).getTime(),
		y1: d.y1,
		y2: d.y2
	}));

	const x = (d: DataRecord) => d.x;
	const y = [(d: DataRecord) => d.y1, (d: DataRecord) => d.y2];

	const tickFormat = (v: Date) =>
		Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric' }).format(v);

	const xScale = Scale.scaleTime();
	function template(d: DataRecord) {
		return `
		<div>
			<p class="text-lg font-bold">Foda</p>
			<p>${Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric' }).format(d.x)}</p>
			<p>${d.y1}, ${d.y2}</p>
		</div>
		`;
	}
</script>

<div class="w-full space-y-6">
	<h3 class="text-center">Grafico foda</h3>
	<VisXYContainer
		{data}
		{xScale}
	>
		<VisLine
			{data}
			{x}
			{y}
		/>
		<VisAxis
			type="x"
			{tickFormat}
			gridLine={false}
		/>
		<VisAxis
			type="y"
			gridLine={false}
		/>
		<VisTooltip />
		<VisCrosshair {template} />
	</VisXYContainer>
</div>
