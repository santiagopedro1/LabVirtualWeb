<script lang="ts">
    import { init } from 'echarts'
    import type { EChartsOption, ECharts } from 'echarts'
    import { onMount } from 'svelte'

    import { theme } from '$lib/stores'

    import ChartFilter from './ChartFilter.svelte'

    export let data: Leitura
    export let displayDate: string

    let myChart: ECharts

    const sensores = [
        {
            id: 1,
            name: '5TE',
            dataRead: [
                'Condutividade',
                'Temperatura(ºC)',
                'Umidade gravimetrica(%)'
            ],
            description: 'Sensor na cova com palha'
        },
        {
            id: 2,
            name: '5TE',
            dataRead: [
                'Condutividade',
                'Temperatura(ºC)',
                'Umidade gravimetrica(%)'
            ],
            description: 'Sensor na cova sem palha'
        }
    ]

    Object.entries(data).forEach(([key1, value1]) => {
        value1.forEach(obj => {
            obj.data_hora = new Date(obj.data_hora).toLocaleTimeString(
                'pt-BR',
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            )
            Object.entries(obj).forEach(([key2, value2], index) => {
                if (index === 0) return
                obj[`${key1}_${key2}`] = value2
                delete obj[key2]
            })
        })
    })

    const TotalSensores = Object.keys(data).length
    const TotalLeituras = Object.keys(data).reduce(
        (total, key) => total + Object.keys(data[key][0]).length - 1,
        0
    )

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
            nameGap: 40
        },

        dataset: new Array(TotalSensores).fill(0).map((_, i) => ({
            id: i + 1,
            source: Object.values(data)[i] as any
        })),

        series: new Array(TotalLeituras).fill(0).map((_, i) => ({
            type: 'line',
            emphasis: {
                focus: 'series'
            },
            datasetIndex: i % TotalSensores
        }))
    }

    function chartDataToggle(id: number, data: string) {
        const chart = myChart

        chart.dispatchAction({
            type: 'legendToggleSelect',
            name: `${id}_${data}`
        })
    }

    onMount(async () => {
        ;(await import('$lib/echartsInit')).chartInit()
        myChart = init(
            document.getElementById('chart') as HTMLDivElement,
            $theme,
            {
                renderer: 'svg'
            }
        )
        myChart.setOption(chartOpts)

        theme.subscribe(async theme => {
            let newTheme
            if (theme === 'dark')
                newTheme = (await import('$lib/echartsInit')).buildTheme('dark')
            else
                newTheme = (await import('$lib/echartsInit')).buildTheme(
                    'light'
                )
            myChart.setOption({
                ...(newTheme as any)
            })
        })
    })
</script>

<div>
    <ChartFilter
        {sensores}
        fn={chartDataToggle}
    />

    <div
        id="chart"
        class="w-full h-96 md:h-[500px]"
    />
</div>
