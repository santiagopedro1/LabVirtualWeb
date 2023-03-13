<script lang="ts">
    import { init } from 'echarts'
    import type { EChartsOption, ECharts } from 'echarts'
    import { onMount } from 'svelte'

    export let data: Leitura
    export let displayDate: string

    let myChart: ECharts

    Object.values(data).forEach((_, i) => {
        Object.values(data)[i].forEach((_, j) => {
            Object.values(data)[i][j].data_hora = new Date(
                Object.values(data)[i][j].data_hora
            ).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        })
    })

    const TotalSensores = Object.keys(data).length
    let TotalLeituras = 0
    Object.values(data).forEach((_, i) => {
        TotalLeituras += Object.keys(Object.values(data)[i][0]).length - 1
    })

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

        dataset: new Array(TotalSensores).fill(0).map((_, i) => ({
            id: i + 1,
            source: Object.values(data)[i] as any
        })),

        series: new Array(TotalLeituras).fill(0).map((_, i) => ({
            type: 'line',
            emphasis: {
                focus: 'series'
            },
            datasetIndex: i < 3 ? 0 : 1
        }))
    }

    onMount(async () => {
        const chartInit = (await import('$lib/echartsInit')).default
        chartInit()
        let theme = document.cookie.split('=')[1]
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

<div
    id="chart"
    class="w-full h-96 md:h-[500px]"
/>
