<script lang="ts">
    import datepicker from '$lib/datepicker'

    import Modal from '$lib/modal.svelte'
    import LineChart from '$lib/lineChart.svelte'

    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    import { getDateObj } from '$lib/dateUtils'

    import { LineChartIcon, FileDown } from 'lucide-svelte'

    import {
        Menu,
        MenuButton,
        MenuItem,
        MenuItems
    } from '@rgossiaux/svelte-headlessui'

    //-----------------------------------------------------------------------------

    let selectedDate: Date
    let dados: {
        leituras: Leitura
        displayDate: string
    } | null = null
    const modal = {
        title: '',
        message: '',
        isOpen: false
    }

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
                        showModal(
                            'Nada encontrado',
                            'Não foram encontradas leituras para a data selecionada'
                        )
                        break
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    function showModal(title: string, message: string) {
        modal.title = title
        modal.message = message
        modal.isOpen = true
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
                    showModal(
                        'Nada encontrado',
                        'Não foram encontradas leituras para a data selecionada'
                    )
                    break
            }
        })
    }

    onMount(async () => {
        await import('$lib/css/datepicker.css')
        datepicker(
            (selectedDay: Date) => (selectedDate = selectedDay),
            selectedDate
        )
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
            readonly
            placeholder="Pick a date"
            class="select-none"
        />
        <button
            title="Criar gráfico dos dados"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            on:click={() => fetchLeituras(selectedDate)}
        >
            <LineChartIcon />
        </button>
        <Menu class="relative">
            <MenuButton
                title="Baixar dados"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md aria-expanded:rounded-b-none aria-expanded:bg-green-700"
            >
                <FileDown />
            </MenuButton>
            <div class="absolute bg-green-500 rounded-b-md">
                <MenuItems class="flex flex-col gap-3">
                    <MenuItem class="flex-grow hover:bg-green-700">
                        <button
                            class="w-full px-4 py-3"
                            id="csv"
                            on:click={() => download('csv')}>CSV</button
                        >
                    </MenuItem>
                    <MenuItem class="flex-grow hover:bg-green-700"
                        ><button
                            class="w-full px-4 py-3"
                            id="json"
                            on:click={() => download('json')}>JSON</button
                        ></MenuItem
                    >
                </MenuItems>
            </div>
        </Menu>
    </section>

    {#if dados}
        <div class="mt-28">
            <LineChart
                data={dados.leituras}
                displayDate={dados.displayDate}
            />
        </div>
    {/if}

    <Modal
        bind:isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
    />
</section>
