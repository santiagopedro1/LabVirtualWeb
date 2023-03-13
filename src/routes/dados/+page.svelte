<script lang="ts">
    import datepicker from '$lib/datepicker'

    import Modal from '$components/modal.svelte'
    import LineChart from '$components/lineChart.svelte'

    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    import { getDateObj } from '$lib/dateUtils'

    import { LineChartIcon } from 'lucide-svelte'

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
        const date = $page.url.searchParams.get('data')!
        const parsedDate = getDateObj(date)
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
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            on:click={() => fetchLeituras(selectedDate)}
        >
            <LineChartIcon />
        </button>
    </section>

    {#if dados}
        <LineChart
            data={dados.leituras}
            displayDate={dados.displayDate}
        />
    {/if}

    <Modal
        bind:isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
    />
</section>
