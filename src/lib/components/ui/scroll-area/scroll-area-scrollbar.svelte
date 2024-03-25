<script lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui';
	import { cn } from '$lib/UIutils.js';
	import { onMount } from 'svelte';

	type $$Props = ScrollAreaPrimitive.ScrollbarProps & {
		orientation?: 'vertical' | 'horizontal';
	};

	let className: $$Props['class'] = undefined;
	export let orientation: $$Props['orientation'] = 'vertical';
	export { className as class };

	onMount(() => {
		const thumb = document.getElementById('thumb');
		if (!thumb) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target instanceof HTMLElement) {
					if (entry.target.offsetHeight == entry.target.parentElement?.offsetHeight! - 2) {
						thumb.classList.add('bg-transparent');
					} else {
						thumb.classList.add('bg-border');
					}
				}
			}
		});

		observer.observe(thumb);

		return () => {
			observer.disconnect();
		};
	});
</script>

<ScrollAreaPrimitive.Scrollbar
	{orientation}
	class={cn(
		'flex touch-none select-none bg-transparent transition-colors',
		orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
		orientation === 'horizontal' && 'h-2.5 w-full border-t border-t-transparent p-px',
		className
	)}
>
	<slot />
	<ScrollAreaPrimitive.Thumb
		id="thumb"
		class={cn('relative rounded-full bg-border', orientation === 'vertical' && 'flex-1')}
	/>
</ScrollAreaPrimitive.Scrollbar>
