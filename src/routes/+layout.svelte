<script lang="ts">
	import '/src/main.css';

	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { Menu, Sun, Moon } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as ScrollArea from '$lib/components/ui/scroll-area';

	import { mediaQuery, preferredDark } from 'svelte-legos';

	export let data: LayoutData;

	const navItems = [
		{
			name: 'início',
			href: '/'
		},
		{
			name: 'dados',
			href: '/dados'
		}
	];

	const isDesktop = mediaQuery('(min-width: 768px)');

	let isDark: boolean;

	switch (data.theme) {
		case 'dark':
			isDark = true;
			break;
		case 'light':
			isDark = false;
			break;
		default:
			isDark = get(preferredDark());
	}

	function updateTheme() {
		document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
		if (isDark) document.documentElement.classList.add('dark', 'theme-dark');
		else document.documentElement.classList.remove('dark', 'theme-dark');
	}

	function toggleTheme() {
		isDark = !isDark;
		updateTheme();
	}

	onMount(() => {
		updateTheme();
	});
</script>

<ScrollArea.Root class="h-screen bg-background text-foreground {isDark ? 'dark' : ''}">
	<div class="bg-primary py-3 pl-6 pr-[calc(1.5rem_-_calc(100vw_-_100%))] text-primary-foreground">
		<div class="flex items-center justify-between">
			{#if $isDesktop}
				<div class="flex items-center">
					<img
						class="mr-8 h-8 w-8"
						src="https://tailwindui.com/img/logos/mark.svg?color=white"
						alt="Your Company"
					/>
					<nav>
						<ul class="flex gap-4">
							{#each navItems as { name, href }}
								<li>
									<a
										class="{$page.url.pathname === href
											? 'cursor-default bg-green-950'
											: 'hover:bg-green-950'}
									text-md rounded-md px-3 py-2 font-bold uppercase text-primary-foreground"
										aria-current={$page.url.pathname === href ? 'page' : undefined}
										{href}
									>
										{name}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				</div>
			{:else}
				<div class="flex w-full items-center">
					<Sheet.Root>
						<Sheet.Trigger
							asChild
							let:builder
						>
							<Button
								builders={[builder]}
								variant="ghost"
								size="icon"
							>
								<Menu />
							</Button>
						</Sheet.Trigger>
						<Sheet.Content side="left">
							<nav>
								<ul class="flex flex-col gap-4">
									{#each navItems as { name, href }}
										<li>
											<Sheet.Close>
												<a
													class="text-md rounded-md px-3 py-2 font-bold uppercase text-primary-foreground {$page
														.url.pathname === href
														? 'bg-primary'
														: ''}"
													aria-current={$page.url.pathname === href ? 'page' : undefined}
													{href}
												>
													{name}
												</a>
											</Sheet.Close>
										</li>
									{/each}
								</ul>
							</nav>
						</Sheet.Content>
					</Sheet.Root>
					<img
						class="mx-auto h-8 w-8"
						src="https://tailwindui.com/img/logos/mark.svg?color=white"
						alt="Your Company"
					/>
				</div>
			{/if}

			<Button
				size="icon"
				variant="ghost"
				on:click={toggleTheme}
			>
				{#if data.theme === 'dark'}
					<Sun />
				{:else}
					<Moon />
				{/if}
			</Button>
		</div>
	</div>
	<main class="grid place-items-center gap-8 px-4 py-12 md:px-32 lg:px-48">
		<slot />
	</main>
</ScrollArea.Root>
