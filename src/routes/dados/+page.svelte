<script lang="ts">
    import datepicker from '$lib/datepicker'

    import Modal from '$components/modal.svelte'

    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    import { getDateObj } from '$lib/dateUtils'

    //-----------------------------------------------------------------------------

    type Leituras_de_sensor = {
        id_sensor_de_usuario: number
        data_hora: string
        leitura: {
            Condutividade: number
            Temperatura: number
            Umidade_gravimetrica: number
        }
    }
    let LineChart: any
    let selectedDate: Date
    let dados: {
        leituras: Leituras_de_sensor[]
        displayDate: string
    }
    const modal = {
        title: '',
        message: '',
        isOpen: false
    }

    if ($page.url.searchParams.has('data')) {
        const date = $page.url.searchParams.get('data')!
        const parsedDate = getDateObj(date)
        if (parsedDate) selectedDate = parsedDate
    }

    async function fetchLeituras(data: Date) {
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
        LineChart = (await import('$components/lineChart.svelte')).default
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
            GERAR GRÁFICO
        </button>
    </section>

    {#if dados}
        {#if dados.leituras.length > 0}
            <svelte:component
                this={LineChart}
                data={dados.leituras}
                displayDate={dados.displayDate}
            />
        {/if}
    {/if}

    <Modal
        bind:isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
    />
</section>
