<script lang="ts">
	import { Scale, type BulletLegendItemInterface, type NumericAccessor } from '@unovis/ts';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';

	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Info } from 'lucide-svelte';

	export let leituras: SensorData[];
	export let sensores: SensorInfo[];
	export let maxYdomain: number;

	const yAccessors: NumericAccessor<SensorData>[] = Object.keys(leituras[0].data).flatMap(
		(sensorId) =>
			Object.keys(leituras[0].data[sensorId]).map((key) => (d: SensorData) => d.data[sensorId][key])
	);

	let y = yAccessors;

	const x: NumericAccessor<SensorData> = (d: SensorData) => d.timestamp.getTime();
	// const colors = ['#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#bb3e03', '#ae2012'];

	// const color = (d: SensorData, i: number) => colors[i];

	const tickFormat = (v: Date) =>
		Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric' }).format(v);

	const xScale = Scale.scaleTime();

	function template(d: SensorData) {
		let dados = '';
		let count = 0;
		Object.keys(d.data).forEach((sensorId: string, i: number) => {
			const sensorData = d.data[sensorId];
			dados += `<p class="text-md font-bold">Sensor ${i + 1}</p>`;
			Object.keys(sensorData).forEach((key: string) => {
				dados += `
					<div class="${items[count].inactive ? 'hidden' : 'flex'} items-center gap-2">
						<div class="w-3 h-3 rounded-full" style="background-color: var(--vis-color${count})"></div>
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

	const keys = Object.keys(leituras[0].data);
	const items: BulletLegendItemInterface[] = [];

	keys.forEach((key, index1) => {
		const attributes = Object.keys(leituras[0].data[key]);
		attributes.forEach((attribute, index2) => {
			items.push({
				name: `${key}_${attribute}`,
				// color: colors[(index1 * attributes.length + index2) % colors.length],
				inactive: false
			});
		});
	});

	const obj = leituras[0];

	interface DataObject {
		[key: string]: {
			[attribute: string]: boolean;
		};
	}

	const newData: DataObject = {};

	Object.keys(obj.data).forEach((key) => {
		newData[key] = {};
		Object.keys(obj.data[key]).forEach((attribute) => {
			newData[key][attribute] = true;
		});
	});

	function toggleAtr(a: any) {
		const clickedId = a.detail.currentTarget.id as number;
		items[clickedId].inactive = !items[clickedId].inactive;
		y = items.map((item, i) => (item.inactive ? null : yAccessors[i]));
	}
</script>

<h3 class="text-center">
	Grafico do dia {new Date(leituras[0].timestamp).toLocaleDateString('pt-BR')}
</h3>
<div class="flex items-center justify-between gap-6">
	{#each Object.keys(newData) as sensor, sensorId}
		<div class="grid place-items-center gap-3">
			<h2 class="flex gap-4">
				Sensor {sensorId + 1}
				<HoverCard.Root>
					<HoverCard.Trigger><Info size="24" /></HoverCard.Trigger>
					<HoverCard.Content class="w-fit text-lg">
						<p><span class="font-extrabold">ID interno:</span> {sensores[sensorId].internalId}</p>
						<p><span class="font-extrabold">Nome:</span> {sensores[sensorId].sensorName}</p>
						<p><span class="font-extrabold">Descrição:</span> {sensores[sensorId].desc}</p>
					</HoverCard.Content>
				</HoverCard.Root>
			</h2>
			{#each Object.keys(newData[sensor]) as attribute, attributeId}
				<div class="grid grid-cols-2 items-center gap-4">
					<Label>{attribute}</Label>
					<Switch
						id={`${(sensorId * Object.keys(newData[sensor]).length + attributeId) % (Object.keys(newData).length * Object.keys(newData[sensor]).length)}`}
						checked={newData[sensor][attribute]}
						on:click={toggleAtr}
					/>
				</div>
			{/each}
		</div>
	{/each}
</div>

<VisXYContainer
	data={leituras}
	{xScale}
	yDomain={[0, maxYdomain]}
	height={500}
	padding={{ top: 15, bottom: 15, left: 15 }}
>
	<VisLine
		{x}
		{y}
		data={leituras}
		highlightOnHover
		lineWidth={3}
	/>
	<VisAxis
		type="x"
		label="Horário"
		{tickFormat}
		gridLine={false}
	/>
	<VisAxis
		type="y"
		label="Valor"
	/>
	<VisTooltip />
	<VisCrosshair {template} />
</VisXYContainer>
