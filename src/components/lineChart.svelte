<script lang="ts">
    import { dispose, init } from 'echarts'
    import type { EChartsOption, ECharts } from 'echarts'
    import { onMount } from 'svelte'
    import { labvTheme } from '$lib/store'
    import chartInit from '$lib/echartsInit'

    type Leituras_de_sensor = {
        id_sensor_de_usuario: number
        data_hora: string
        leitura: {
            Condutividade: number
            Temperatura: number
            Umidade_gravimetrica: number
        }
    }

    export let data: Leituras_de_sensor[]
    export let displayDate: string

    let myChart: ECharts
    let theme: string

    labvTheme.subscribe(value => {
        theme = value
        if (!myChart) return
        dispose(myChart)
        myChart = init(
            document.getElementById('chart') as HTMLDivElement,
            theme,
            {
                renderer: 'svg'
            }
        )
        myChart.setOption(chartOpts)
    })

    function createDataset(data: Leituras_de_sensor[]) {
        let horas: string[] = []
        let aCondutividade: Number[] = []
        let aTemperatura: Number[] = []
        let aUmidadeGravimetrica: Number[] = []
        let bCondutividade: Number[] = []
        let bTemperatura: Number[] = []
        let bUmidadeGravimetrica: Number[] = []

        data.forEach(leituraDeSensor => {
            const displayHora = leituraDeSensor.data_hora
                .split('T')[1]
                .split(':')
            horas.push(displayHora[0] + ':' + displayHora[1])
            switch (leituraDeSensor.id_sensor_de_usuario) {
                case 1:
                    aCondutividade.push(leituraDeSensor.leitura.Condutividade)
                    aTemperatura.push(leituraDeSensor.leitura.Temperatura)
                    aUmidadeGravimetrica.push(
                        leituraDeSensor.leitura.Umidade_gravimetrica
                    )
                    break
                case 2:
                    bCondutividade.push(leituraDeSensor.leitura.Condutividade)
                    bTemperatura.push(leituraDeSensor.leitura.Temperatura)
                    bUmidadeGravimetrica.push(
                        leituraDeSensor.leitura.Umidade_gravimetrica
                    )
                    break
            }
        })

        const horasSet = horas.filter((v, i, a) => a.indexOf(v) === i)

        const DadosA = [
            ['Hora', 'aCondutividade', 'aTemperatura', 'aUmidade gravimétrica'],
            ...horasSet.map(hora => [
                hora,
                aCondutividade[horasSet.indexOf(hora)],
                aTemperatura[horasSet.indexOf(hora)],
                aUmidadeGravimetrica[horasSet.indexOf(hora)]
            ])
        ]

        const DadosB = [
            ['Hora', 'bCondutividade', 'bTemperatura', 'bUmidade gravimétrica'],
            ...horasSet.map(hora => [
                hora,
                bCondutividade[horasSet.indexOf(hora)],
                bTemperatura[horasSet.indexOf(hora)],
                bUmidadeGravimetrica[horasSet.indexOf(hora)]
            ])
        ]

        return [DadosA, DadosB]
    }

    const Dados = createDataset(data)

    const chartOpts: EChartsOption = {
        tooltip: {},
        toolbox: {
            right: 60,
            top: 0
        },
        legend: {
            show: false
        },
        title: {
            text: `Gráfico do dia ${displayDate}`
        },
        xAxis: {
            name: 'Tempo',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'category',
            boundaryGap: true,
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            name: 'Valores',
            type: 'value',
            scale: true,
            nameLocation: 'middle',
            nameRotate: 90,
            nameGap: 30
        },

        dataset: new Array(Dados.length).fill(0).map((_, i) => ({
            source: Dados[i] as any
        })),

        series: new Array(6).fill(0).map((_, i) => ({
            type: 'line',
            emphasis: {
                focus: 'series'
            },
            datasetIndex: i < 3 ? 0 : 1
        }))
    }

    function highlight(foda: MouseEvent) {
        const target = foda.target as HTMLDivElement

        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: target.id === 'A' ? [0, 1, 2] : [3, 4, 5]
        })
    }

    function unhighlight(foda: Event) {
        const target = foda.target as HTMLDivElement

        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: target.id === 'A' ? [0, 1, 2] : [3, 4, 5]
        })
    }

    function toggle(foda: Event) {
        const target = foda.target as HTMLDivElement

        if (target.id === 'A') {
            myChart.dispatchAction({
                type: 'legendToggleSelect',
                name: 'aCondutividade'
            })
            myChart.dispatchAction({
                type: 'legendToggleSelect',
                name: 'aTemperatura'
            })
            myChart.dispatchAction({
                type: 'legendToggleSelect',
                name: 'aUmidade gravimétrica'
            })
        } else {
            myChart.dispatchAction({
                type: 'legendToggleSelect',
                name: 'bCondutividade'
            })
            myChart.dispatchAction({
                type: 'legendToggleSelect',
                name: 'bTemperatura'
            })
            myChart.dispatchAction({
                type: 'legendToggleSelect',
                name: 'bUmidade gravimétrica'
            })
        }
    }

    function reload(newData: Leituras_de_sensor[]) {
        if (!myChart) return
        const newDados = createDataset(newData)
        const newOpts = {
            title: {
                text: `Gráfico do dia ${displayDate}`
            },
            dataset: new Array(newDados.length).fill(0).map((_, i) => ({
                source: newDados[i] as any
            }))
        }
        myChart.setOption(newOpts)
    }

    $: data, reload(data)

    onMount(() => {
        chartInit()
        theme = localStorage.getItem('labv-theme') === 'dark' ? 'dark' : 'light'
        myChart = init(
            document.getElementById('chart') as HTMLDivElement,
            theme,
            {
                renderer: 'svg'
            }
        )
        myChart.setOption(chartOpts)
    })
</script>

<div>
    <h1>Chart!</h1>
    <div class="flex gap-5">
        <button
            id="A"
            class="px-4 py-2 my-4 h-8 bg-cyan-600"
            on:mouseenter={highlight}
            on:mouseleave={unhighlight}
            on:click={toggle}
        />
        <button
            id="B"
            class="px-4 py-2 my-4 h-8 bg-cyan-600"
            on:mouseenter={highlight}
            on:mouseleave={unhighlight}
            on:click={toggle}
        />
    </div>
    <div
        id="chart"
        class="w-full h-96 md:h-[500px]"
    />
</div>
