<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';

	import { Calendar as CalendarIcon } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		CalendarDate
	} from '@internationalized/date';
	import { cn } from '$lib/UIutils';

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'short'
	});

	let value: DateValue | undefined = undefined;

	export let minValue = new CalendarDate(2022, 2, 11);
	export let maxValue = new CalendarDate(2022, 10, 5);
</script>

<div>
	<Popover.Root>
		<Popover.Trigger
			asChild
			let:builder
		>
			<Button
				variant="outline"
				class={cn(
					'w-[280px] justify-start text-left font-normal',
					!value && 'text-muted-foreground'
				)}
				builders={[builder]}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar
				bind:value
				initialFocus
				locale="pt-BR"
				{minValue}
				{maxValue}
				placeholder={maxValue}
			/>
		</Popover.Content>
	</Popover.Root>

	<input
		type="hidden"
		name="date"
		value={value?.toDate(getLocalTimeZone())}
	/>
</div>

<!-- <CalendarPrimitive.Root
	{weekdayFormat}
	class={cn('rounded-md border p-3 w-80', className)}
	{...$$restProps}
	on:keydown
	let:months
	let:weekdays
	bind:value
	bind:placeholder
	locale="pt-BR"
	maxValue={todayDate}
>
	<Calendar.Header class="space-x-2">
		<Calendar.PrevButton>
			<ChevronLeft class=" size-7" />
		</Calendar.PrevButton>
		<Calendar.Heading class="flex w-full items-center justify-between gap-2">
			<Select.Root
				selected={defaultMonth}
				items={monthOptions}
				onSelectedChange={(v) => {
					if (!v || !placeholder) return;
					if (v.value === placeholder?.month) return;
					placeholder = placeholder.set({ month: v.value });
				}}
			>
				<Select.Trigger aria-label="Selecionar mês" class="w-[60%] capitalize">
					<Select.Value placeholder="Mês" />
				</Select.Trigger>
				<Select.Content>
					<ScrollArea class="h-52">
						{#each monthOptions as { value, label }}
							<Select.Item {value} {label}>
								{label}
							</Select.Item>
						{/each}
					</ScrollArea>
				</Select.Content>
			</Select.Root>
			<Select.Root
				selected={defaultYear}
				items={yearOptions}
				onSelectedChange={(v) => {
					if (!v || !placeholder) return;
					if (v.value === placeholder?.year) return;
					placeholder = placeholder.set({ year: v.value });
				}}
			>
				<Select.Trigger aria-label="Selecionar ano" class="w-[40%]">
					<Select.Value placeholder="Ano" />
				</Select.Trigger>
				<Select.Content>
					<ScrollArea class="h-52">
						{#each yearOptions as { value, label }}
							<Select.Item {value} {label}>
								{label}
							</Select.Item>
						{/each}
					</ScrollArea>
				</Select.Content>
			</Select.Root>
		</Calendar.Heading>
		<Calendar.NextButton>
			<ChevronRight class=" size-7" />
		</Calendar.NextButton>
	</Calendar.Header>
	<Calendar.Months>
		{#each months as month}
			<Calendar.Grid>
				<Calendar.GridHead>
					<Calendar.GridRow class="flex justify-center gap-2">
						{#each weekdays as weekday}
							<Calendar.HeadCell class="capitalize">
								{weekday.slice(0, 3)}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="mt-2 w-full flex justify-center gap-2">
							{#each weekDates as date}
								<Calendar.Cell {date}>
									<Calendar.Day {date} month={month.value} />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</Calendar.Months>
</CalendarPrimitive.Root> -->
