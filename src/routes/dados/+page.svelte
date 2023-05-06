<script lang="ts">
    import flatpickr from 'flatpickr'
    import { Portuguese } from 'flatpickr/dist/l10n/pt.js'

    import DataChart from '$lib/DataChart.svelte'
    import {
        modalStore,
        popup,
        type PopupSettings
    } from '@skeletonlabs/skeleton'

    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    import { getDateObj } from '$lib/dateUtils'

    import { LineChart, FileDown } from 'lucide-svelte'

    let popupCombobox: PopupSettings = {
        event: 'focus-click',
        target: 'combobox',
        placement: 'bottom',
        closeQuery: 'li'
    }

    //-----------------------------------------------------------------------------
    let selectedDate: Date
    let dados: {
        leituras: Leitura
        displayDate: string
    } | null = null

    if ($page.url.searchParams.has('data')) {
        const data = $page.url.searchParams.get('data')!
        const parsedDate = getDateObj(data)
        if (parsedDate && parsedDate < new Date()) selectedDate = parsedDate
    }

    onMount(() => {
        const datepickerEl = document.getElementById(
            'datepicker'
        ) as HTMLInputElement

        if (selectedDate) {
            datepickerEl.value = selectedDate.toLocaleDateString('pt-BR')
        }
        import('flatpickr/dist/themes/material_green.css')

        flatpickr(datepickerEl, {
            locale: Portuguese,
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
</script>

<svelte:head>
    <title>Dados - Labvirtual</title>
</svelte:head>

<section class="dark:text-white">
    <p>Selecione uma data para ver os dados</p>

    <form
        action="/api/leituras"
        on:submit|preventDefault={handleSubmit}
        class="flex gap-6 items-center my-4"
    >
        <input
            id="datepicker"
            type="text"
            placeholder="Escolha uma data"
            name="data"
            required
        />
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
            <DataChart
                data={dados.leituras}
                displayDate={dados.displayDate}
            />
        </div>
    {/if}
</section>
