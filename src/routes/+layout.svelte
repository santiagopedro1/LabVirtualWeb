<script lang="ts">
    import '$lib/css/theme.postcss'
    import '@skeletonlabs/skeleton/styles/all.css'
    import '$lib/css/app.postcss'

    import { Menu, Sun, Moon, X } from 'lucide-svelte'
    import { page } from '$app/stores'
    import { theme } from '$lib/stores'
    import {
        AppBar,
        AppShell,
        Drawer,
        drawerStore,
        Modal,
        storePopup
    } from '@skeletonlabs/skeleton'
    import {
        computePosition,
        autoUpdate,
        flip,
        shift,
        offset,
        arrow
    } from '@floating-ui/dom'
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

    theme.set($page.data.theme)

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
        theme.update(t => (t === 'dark' ? 'light' : 'dark'))
        document.cookie = `labvTheme=${$theme}; path=/; max-age=${
            60 * 60 * 24 * 365
        }; sameSite=lax;`
    }

    function openDrawer() {
        drawerStore.open()
    }
</script>

<Drawer
    bgDrawer="bg-primary-500"
    width=" w-1/2"
    rounded="rounded-none"
>
    <div class="p-6 space-y-4">
        <button on:click={drawerStore.close}>
            <X color="white" />
        </button>
        <nav class="list-nav">
            <ul>
                {#each navItems as item}
                    <li>
                        <a
                            href={item.href}
                            class="{$page.url.pathname === item.href
                                ? 'bg-primary-800 cursor-default'
                                : 'hover:bg-primary-700'}
                                            text-white text-md font-bold uppercase px-3 py-2 rounded-md"
                            aria-current={$page.url.pathname === item.href
                                ? 'page'
                                : undefined}
                        >
                            {item.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</Drawer>

<Modal duration={0} />

<AppShell class={$theme === 'dark' ? 'dark bg-zinc-900' : 'bg-primary-50'}>
    <svelte:fragment slot="header">
        <AppBar
            background="bg-primary-500"
            padding="px-6 py-3"
        >
            <svelte:fragment slot="lead">
                <button
                    class="md:hidden mr-4"
                    on:click={openDrawer}
                >
                    <Menu color="white" />
                </button>
                <img
                    class="h-8 w-8 mr-8"
                    src="https://tailwindui.com/img/logos/mark.svg?color=white"
                    alt="Your Company"
                />
                <nav class="hidden md:block">
                    <ul class="flex items-baseline space-x-4">
                        {#each navItems as item}
                            <li>
                                <a
                                    href={item.href}
                                    class="{$page.url.pathname === item.href
                                        ? 'bg-primary-900 cursor-default text-white'
                                        : 'hover:bg-primary-800 text-white'}
                                        text-md font-bold uppercase px-3 py-2 rounded-md"
                                    aria-current={$page.url.pathname ===
                                    item.href
                                        ? 'page'
                                        : undefined}
                                >
                                    {item.name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </nav>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <button
                    on:click={toggleTheme}
                    class="h-10 w-10 flex justify-center items-center rounded-md text-white hover:text-black"
                >
                    {#if $theme === 'dark'}
                        <Sun />
                    {:else if $theme === 'light'}
                        <Moon />
                    {:else}
                        <span class="sr-only">Loading...</span>
                    {/if}
                </button>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <div class="p-10 md:mx-8 md:my-6">
        <slot />
    </div>
</AppShell>
