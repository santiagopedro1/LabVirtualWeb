<script lang="ts">
    import '$lib/css/app.css'
    import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel
    } from '@rgossiaux/svelte-headlessui'
    import { Menu, Sun, Moon } from 'lucide-svelte'
    import { page } from '$app/stores'

    let theme: 'light' | 'dark' = $page.data.theme

    const navItems = [
        {
            name: 'início',
            href: '/'
        },
        {
            name: 'dados',
            href: '/dados'
        }
    ]

    function toggleTheme() {
        theme = theme === 'dark' ? 'light' : 'dark'
        document.cookie = `labvTheme=${theme}; path=/; max-age=${
            60 * 60 * 24 * 365
        }; sameSite=lax;`
    }
</script>

<div class="{theme === 'dark' ? 'dark' : ''} min-h-screen">
    <div class="min-h-screen dark:text-white bg-white dark:bg-slate-900">
        <Disclosure
            as="nav"
            class="bg-primary w-full"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <img
                                class="h-8 w-8"
                                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                                alt="Your Company"
                            />
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                {#each navItems as item}
                                    <a
                                        href={item.href}
                                        class="{$page.url.pathname === item.href
                                            ? 'bg-green-800 cursor-default'
                                            : 'hover:bg-green-700'}
                                        text-white text-md font-bold uppercase px-3 py-2 rounded-md"
                                        aria-current={$page.url.pathname ===
                                        item.href
                                            ? 'page'
                                            : undefined}
                                    >
                                        {item.name}
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </div>
                    <div class="ml-auto flex items-center md:ml-6">
                        <button
                            on:click={toggleTheme}
                            class="h-10 w-10 flex justify-center items-center rounded-md text-white hover:text-black"
                        >
                            {#if theme === 'dark'}
                                <Sun />
                            {:else if theme === 'light'}
                                <Moon />
                            {:else}
                                <span class="sr-only">Loading...</span>
                            {/if}
                        </button>
                    </div>
                    <div class="-mr-2 flex md:hidden">
                        <!-- Mobile menu button -->
                        <DisclosureButton
                            class="inline-flex items-center justify-center rounded-md p-2 shadow hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span class="sr-only">Open main menu</span>
                            <Menu
                                class="block h-6 w-6 text-white"
                                aria-hidden="true"
                            />
                        </DisclosureButton>
                    </div>
                </div>
            </div>

            <DisclosurePanel class="md:hidden">
                <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    {#each navItems as item}
                        <DisclosureButton
                            as="a"
                            href={item.href}
                            class="{$page.url.pathname === item.href
                                ? 'bg-green-800 cursor-default'
                                : 'hover:bg-green-700'} block px-3 py-2 rounded-md text-white uppercase"
                            aria-current={$page.url.pathname === item.href
                                ? 'page'
                                : undefined}
                        >
                            {item.name}
                        </DisclosureButton>
                    {/each}
                </div>
            </DisclosurePanel>
        </Disclosure>
        <main>
            <div class="py-6 sm:px-6 lg:px-8">
                <div
                    class="px-4 py-3 md:px-8 md:py-6 min-h-[78vh] dark:bg-zinc-900 bg-green-50"
                >
                    <slot />
                </div>
            </div>
        </main>
    </div>
</div>
