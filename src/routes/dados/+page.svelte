<script lang="ts">
	import { enhance } from '$app/forms';
	import Datepicker from '$lib/components/Datepicker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { ChevronDown } from 'lucide-svelte';

	let open = false;
</script>

<form
	method="POST"
	id="dados"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted
		// add the submitter's `id` to the `FormData` object
		formData.append('tipo', submitter?.id || 'grafico');

		for (const entry of formData.entries()) {
			console.log(entry);
		}

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}}
	class="flex gap-8"
>
	<Datepicker />
	<Button
		id="grafico"
		type="submit">Gráfico</Button
	>
	<Popover.Root bind:open>
		<Popover.Trigger
			asChild
			let:builder
		>
			<Button
				builders={[builder]}
				class="flex justify-between gap-6"
			>
				Download
				<ChevronDown size="12" />
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
