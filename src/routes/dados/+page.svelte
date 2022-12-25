<script lang="ts">
    import datepicker from '$lib/datepicker'
    import '$lib/css/datepicker.css'

    import Modal from '$components/modal.svelte'
    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    import { getDateObj } from '$lib/dateUtils'

    import type { Leituras_de_sensor } from '@prisma/client'

    import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

    //-----------------------------------------------------------------------------

    let selectedDate: Date
    let dados: Array<Leituras_de_sensor>
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
        const response = await fetch(
            `/api/leituras?date=${data.toLocaleDateString('pt-BR')}`,
            {
                headers: {
                    key: '123'
                }
            }
        )
        if (response.ok) {
            dados = await response.json()
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
    <h2 class="text-xl ">About</h2>

    <section>
        <h3>Pick a date any date</h3>
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
        VAI!
    </button>

    {#if dados}
        <div class="mt-5">
            <table class=" w-full">
                <thead>
                    <tr class="border border-red-600 text-center">
                        <th class="border border-red-500 px-4">ID do sensor</th>
                        <th class="border border-red-500 px-4">Data e hora</th>
                        <th class="border border-red-500 px-4">Leitura</th>
                    </tr>
                </thead>
                <tbody>
                    {#each dados as dado}
                        <tr class="border border-red-600 p-5 text-center">
                            <td class="border border-red-600 p-5">
                                {dado.id_sensor_de_usuario}
                            </td>
                            <td class="border border-red-600 p-5">
                                {new Date(dado.data_hora).toLocaleString(
                                    'pt-BR'
                                )}
                            </td>
                            <td>
                                {#each Object.entries(Object(dado.leitura)) as [keys, values]}
                                    <p>{keys}: {values}</p>
                                {/each}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    <Modal
        bind:isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
    />
</section>
