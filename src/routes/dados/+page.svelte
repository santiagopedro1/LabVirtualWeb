<script lang="ts">
    import datepicker from '$lib/datepicker'
    import get from 'axios'

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

    async function vai() {
        if (!selectedDate) return
        const LS = localStorage.getItem(
            'leituras-' + selectedDate.toLocaleDateString('pt-BR')
        )
        if (LS) {
            const decompress = await fetch('/api/compress', {
                method: 'POST',
                headers: {
                    modo: 'decompress',
                    key: '123'
                },
                body: JSON.stringify({
                    input: LS
                })
            }).then(res => res.json())

            if (decompress.output) {
                dados = JSON.parse(decompress.output) as any
                console.log(
                    'Leituras desta data já foram buscadas, usando dados do cache'
                )
            }
        } else fetchLeituras(selectedDate)
    }

    async function fetchLeituras(data: Date) {
        console.log('Buscando dados da API')
        get(`/api/leituras?date=${data.toLocaleDateString('pt-BR')}`, {
            headers: {
                key: '123'
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    dados = response.data
                    const compressedData = await fetch('/api/compress', {
                        method: 'POST',
                        headers: {
                            modo: 'compress',
                            key: '123'
                        },
                        body: JSON.stringify({
                            input: JSON.stringify(dados)
                        })
                    }).then(res => res.json())
                    localStorage.setItem(
                        'leituras-' + data.toLocaleDateString('pt-BR'),
                        compressedData.output
                    )
                } else {
                    switch (response.status) {
                        case 404:
                            showModal(
                                'Nada encontrado',
                                'Não foram encontradas leituras para a data selecionada'
                            )
                            break
                    }
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
    <h2 class="text-xl ">Pick a date any date</h2>

    <section>
        <input
            id="datepicker"
            type="text"
            readonly
            placeholder="Pick a date"
            class="my-4 select-none"
        />
    </section>

    <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        on:click={vai}
    >
        VAI
    </button>

    {#if dados}
        {#if dados.leituras.length > 0}
            <svelte:component
                this={LineChart}
                data={dados.leituras}
                displayDate={dados.displayDate}
            />
        {/if}
    {:else}
        <p>Selecione uma data para ver os dados</p>
    {/if}

    <Modal
        bind:isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
    />
</section>
