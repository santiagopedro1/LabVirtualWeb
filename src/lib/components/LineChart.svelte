<script lang="ts">
	import { Scale } from '@unovis/ts';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';

	type DataRecord = {
		timestamp: Date;
		data: {
			[sensorId: string]: {
				[key: string]: number;
			};
		};
	};

	export let data: DataRecord[];

	const y: ((d: DataRecord) => number)[] = Object.keys(data[0].data).flatMap((sensorId) =>
		Object.keys(data[0].data[sensorId]).map((key) => (d: DataRecord) => d.data[sensorId][key])
	);

	const x = (d: DataRecord) => d.timestamp.getTime();
	const colors = ['#f93414', '#fe6c31', '#feae6c', '#06889b', '#006b8f', '#011f51'];

	const color = (d: DataRecord, i: number) => colors[i];

	const lineConfig = {
		data,
		x,
		y,
		color
	};

	const tickFormat = (v: Date) =>
		Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric' }).format(v);

	const xScale = Scale.scaleTime();

	function template(d: DataRecord) {
		let dados = '';
		Object.keys(d.data).forEach((sensorId: string, i: number) => {
			const sensorData = d.data[sensorId];
			let count = 0;
			dados += `<p class="text-md font-bold">Sensor ${i + 1}</p>`;
			Object.keys(sensorData).forEach((key: string) => {
				dados += `
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full" style="background-color: ${colors[count + (i === 1 ? 3 : 0)]}"></div>
						<p class="text-sm">
							<span class="font-bold">${key}</span>: ${sensorData[key]}
						</p>
					</div>
				`;
				count++;
			});
		});
		return `
		<div>
			<p class="text-lg font-bold">${Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric' }).format(d.timestamp)}</p>
			${dados}
		</div>
		`;
	}
</script>

<!-- <div class="w-full space-y-6"> -->
<h3 class="text-center">Grafico do dia</h3>
<VisXYContainer
	{data}
	{xScale}
>
	<VisLine {...lineConfig} />
	<VisAxis
		type="x"
		label="Horário"
		{tickFormat}
		gridLine={false}
	/>
	<VisAxis
		type="y"
		label="Valor"
		gridLine={false}
	/>
	<VisTooltip />
	<VisCrosshair
		{template}
		{color}
	/>
</VisXYContainer>
<!-- </div> -->
