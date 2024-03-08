<script lang="ts">
	import '/src/main.css';

	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { Menu, Sun, Moon } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';

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

	function updateCookie() {
		document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
	}

	function toggleTheme() {
		isDark = !isDark;
		updateCookie();
	}

	onMount(() => {
		if (!data.theme) updateCookie();
	});
</script>

<div class="min-h-screen bg-background text-foreground {isDark ? 'dark' : ''}">
	<div class="bg-primary px-6 py-3 text-primary-foreground">
		<div class="flex items-center justify-between">
			{#if $isDesktop}
				<div class="flex items-center">
					<img
						class="h-8 w-8 mr-8"
						src="https://tailwindui.com/img/logos/mark.svg?color=white"
						alt="Your Company"
					/>
					<nav>
						<ul class="flex gap-4">
							{#each navItems as { name, href }}
								<li>
									<a
										class="{$page.url.pathname === href
											? 'bg-green-950 cursor-default'
											: 'hover:bg-green-950'}
									text-md font-bold uppercase px-3 py-2 rounded-md text-primary-foreground"
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
				<div class="flex items-center w-full">
					<Sheet.Root>
						<Sheet.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" size="icon">
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
													class="text-md font-bold uppercase px-3 py-2 rounded-md text-primary-foreground {$page
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
						class="h-8 w-8 mx-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=white"
						alt="Your Company"
					/>
				</div>
			{/if}

			<Button size="icon" variant="ghost" on:click={toggleTheme}>
				{#if data.theme === 'dark'}
					<Sun />
				{:else}
					<Moon />
				{/if}
			</Button>
		</div>
	</div>
	<main class="py-12 lg:px-48 md:px-32 px-4 grid place-items-center">
		<slot />
	</main>
</div>
