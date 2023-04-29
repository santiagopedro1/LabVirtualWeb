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

    async function fetchLeituras(data: Date) {
        dados = null
        console.log('Buscando dados da API')
        fetch(`/api/leituras?date=${data.toLocaleDateString('pt-BR')}`, {
            headers: {
                key: '123'
            }
        })
            .then(async response => {
                switch (response.status) {
                    case 200:
                        dados = await response.json()
                        break
                    default:
                        modalStore.trigger({
                            type: 'alert',
                            title: 'Nada encontrado',
                            body: 'Não foram encontradas leituras para a data selecionada',
                            buttonTextCancel: 'Ok'
                        })
                        break
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    async function download(format: 'json' | 'csv') {
        await fetch(
            `/api/download?date=${selectedDate.toLocaleDateString(
                'pt-BR'
            )}&format=${format}`,
            {
                headers: {
                    key: '123',
                    format: format
                }
            }
        ).then(async response => {
            switch (response.status) {
                case 200:
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `dados-${selectedDate.toLocaleDateString(
                        'pt-BR'
                    )}.${format}`
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    break
                default:
                    modalStore.trigger({
                        type: 'alert',
                        title: 'Nada encontrado',
                        body: 'Não foram encontradas leituras para a data selecionada',
                        buttonTextCancel: 'Ok'
                    })
                    break
            }
        })
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
</script>

<svelte:head>
    <title>Dados - Labvirtual</title>
</svelte:head>

<section class="dark:text-white">
    <p>Selecione uma data para ver os dados</p>

    <section class="flex gap-6 items-center my-4">
        <input
            id="datepicker"
            type="text"
            placeholder="Pick a date"
        />
        <button
            title="Criar gráfico dos dados"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            on:click={() => fetchLeituras(selectedDate)}
        >
            <LineChart />
        </button>

        <button
            title="Download dos dados"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            use:popup={popupCombobox}
        >
            <FileDown />
        </button>
    </section>

    {#if dados}
        <div>
            <DataChart
                data={dados.leituras}
                displayDate={dados.displayDate}
            />
        </div>
    {/if}
</section>

<div
    class="card shadow-xl py-2"
    data-popup="combobox"
>
    <ul class="space-y-1 mx-px flex flex-col w-32 dark:text-white text-black">
        <li class="hover:bg-surface-200-700-token">
            <button
                class="p-2 w-full"
                on:click={() => download('json')}>JSON</button
            >
        </li>
        <li class="hover:bg-surface-200-700-token">
            <button
                class="p-2 w-full"
                on:click={() => download('csv')}>CSV</button
            >
        </li>
    </ul>
    <!-- Arrow -->
    <div class="arrow bg-surface-100-800-token" />
</div>
