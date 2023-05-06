<script lang="ts">
    import {
        modalStore,
        popup,
        type PopupSettings
    } from '@skeletonlabs/skeleton'

    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    import { LineChart, FileDown } from 'lucide-svelte'

    let selectedDate: Date
    let popupCombobox: PopupSettings = {
        event: 'focus-click',
        target: 'combobox',
        placement: 'bottom',
        closeQuery: 'li'
    }
    let dados: {
        leituras: Leitura
        displayDate: string
    } | null = null
    let dataChartComponent: typeof import('$lib/DataChart.svelte').default

    async function handleSubmit(foda: Event) {
        const form = foda.target as HTMLFormElement

        const params = new URLSearchParams(
            new FormData(form) as unknown as Record<string, string>
        )

        const url = new URL(form.action)
        url.search = params.toString()

        const res = await fetch(url, {
            headers: {
                key: '123'
            }
        })
        if (res.ok) {
            dataChartComponent = (await import('$lib/DataChart.svelte')).default
            if (params.get('download')) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `dados-${selectedDate.toLocaleDateString(
                    'pt-BR'
                )}.${params.get('download')}`
                document.body.appendChild(a)
                a.click()
                a.remove()
            } else dados = await res.json()
        } else {
            const body = await res.json()
            modalStore.trigger({
                type: 'alert',
                title: 'Erro ao buscar dados',
                body: body.message,
                buttonTextCancel: 'Ok'
            })
        }

        const inputs = document.querySelectorAll(
            'input[name="download"]'
        ) as NodeListOf<HTMLInputElement>
        inputs.forEach(input => input.remove())
    }

    function handleDL(ev: Event) {
        const target = ev.target as HTMLButtonElement
        const format = target.textContent?.toLowerCase() as 'json' | 'csv'
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'download'
        input.value = format
        target.form?.appendChild(input)
    }

    onMount(async () => {
        let date: string | null = null
        if ($page.url.searchParams.has('data')) {
            date = $page.url.searchParams.get('data')
        }
        const datepickerEl = document.getElementById(
            'datepicker'
        ) as HTMLInputElement
        if (date) {
            datepickerEl.value = date
        }
        import('flatpickr/dist/themes/material_green.css')
        import('flatpickr')
            .then(({ default: flatpickr }) => flatpickr)
            .then(flatpickr => {
                import('flatpickr/dist/l10n/pt.js').then(({ Portuguese }) => {
                    flatpickr.localize(Portuguese)
                    flatpickr(datepickerEl, {
                        dateFormat: 'd/m/Y',
                        allowInput: true,
                        maxDate: 'today',
                        onChange: dates => {
                            if (dates[0]) {
                                selectedDate = dates[0]
                            }
                        }
                    })
                })
            })
    })
</script>

<svelte:head>
    <title>Dados - Labvirtual</title>
</svelte:head>

<section class="dark:text-white">
    <form
        action="/api/leituras"
        on:submit|preventDefault={handleSubmit}
        class="flex flex-wrap gap-6 items-center my-4"
    >
        <div class="space-y-2">
            <label for="datepicker">Data</label>
            <input
                id="datepicker"
                type="text"
                placeholder="Escolha uma data"
                name="data"
                required
            />
        </div>
        <div class="space-y-2 rounded-lg outline outline-primary-500 p-2">
            <legend>Quais dados deseja ver</legend>
            <div class="flex space-x-2 p-3">
                <label class="flex items-center space-x-2">
                    <input
                        class="radio"
                        type="radio"
                        checked
                        name="userId"
                        value="1"
                    />
                    <p>Solo</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input
                        class="radio"
                        type="radio"
                        name="userId"
                        value="2"
                    />
                    <p>Abelhas</p>
                </label>
            </div>
            <p>No momento isto não está funcionando</p>
            <p>Só estão sendo pegos os dados do solo</p>
        </div>
        <div class="space-x-3">
            <button
                type="submit"
                title="Criar gráfico dos dados"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
                <LineChart />
            </button>
            <button
                type="button"
                title="Download dos dados"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                use:popup={popupCombobox}
            >
                <FileDown />
            </button>
        </div>
        <div
            class="card shadow-xl py-2"
            data-popup="combobox"
        >
            <ul
                class="space-y-1 mx-px flex flex-col w-32 dark:text-white text-black"
            >
                <li class="hover:bg-surface-200-700-token">
                    <button
                        on:click={handleDL}
                        class="p-2 w-full"
                    >
                        JSON</button
                    >
                </li>
                <li class="hover:bg-surface-200-700-token">
                    <button
                        class="p-2 w-full"
                        on:click={handleDL}>CSV</button
                    >
                </li>
            </ul>
            <!-- Arrow -->
            <div class="arrow bg-surface-100-800-token" />
        </div>
    </form>

    {#if dados}
        <div>
            <svelte:component
                this={dataChartComponent}
                data={dados.leituras}
                displayDate={dados.displayDate}
            />
        </div>
    {/if}
</section>
