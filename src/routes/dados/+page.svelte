<script lang="ts">
    import datepicker from '$lib/datepicker'
    import '$lib/css/datepicker.css'
    import get from 'axios'
    import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

    import Modal from '$components/modal.svelte'
    import LineChart from '$components/lineChart.svelte'

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

    let selectedDate: Date
    let dados: Leituras_de_sensor[]
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
            dados = JSON.parse(decompressFromUTF16(LS) ?? '')
            if (!(dados satisfies Leituras_de_sensor[]))
                fetchLeituras(selectedDate)
            console.log(
                'Leituras desta data já foram buscadas, usando dados do cache'
            )
        } else fetchLeituras(selectedDate)
    }

    async function fetchLeituras(data: Date) {
        console.log('Buscando dados da API')
        get(`/api/leituras?date=${data.toLocaleDateString('pt-BR')}`, {
            headers: {
                key: '123'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    dados = response.data
                    localStorage.setItem(
                        'leituras-' + data.toLocaleDateString('pt-BR'),
                        compressToUTF16(JSON.stringify(dados))
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

    onMount(() => {
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
        {#if dados.length > 0}
            <LineChart data={dados} />
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
