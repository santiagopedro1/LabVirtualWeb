<script lang="ts">
    import type { EChartsOption, ECharts } from 'echarts'
    import { onMount } from 'svelte'

    import { theme } from '$lib/stores'

    export let data: Leitura
    export let sensores: SensorInfo[]

    const parsedData = parseData(data)

    let myChart: ECharts
    let chartFilter: typeof import('$lib/ChartFilter.svelte').default

    const TotalSeries = Object.values(data.leituras).reduce(
        (total, obj) => total + Object.keys(obj).length,
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
            text: `Gráfico do dia ${new Date(data.data).toLocaleDateString(
                'pt-BR'
            )}`
        },
        xAxis: {
            name: 'Horário',
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

        dataset: {
            source: [...parsedData.values],
            dimensions: [...parsedData.headers]
        },
        series: new Array(TotalSeries).fill(0).map((_, i) => ({
            type: 'line',
            emphasis: {
                focus: 'series'
            }
        }))
    }

    function parseData(data: Leitura) {
        const headers = ['Horario']

        for (const key in data.leituras) {
            const item = data.leituras[key]
            for (const name in item) {
                headers.push(`sensor${key}_${name}`)
            }
        }

        const values = data.horario.map((horario, index) => {
            const row: Array<number | string> = [horario]
            for (const i in data.leituras) {
                for (let j in data.leituras[i]) {
                    row.push(data.leituras[i][j][index])
                }
            }
            return row
        })

        return { headers, values }
    }

    function chartDataToggle(id: number, data: string) {
        const chart = myChart
        if (data.includes(' ')) data = data.replace(' ', '_')
        chart.dispatchAction({
            type: 'legendToggleSelect',
            name: `sensor${id}_${data}`
        })
    }

    onMount(async () => {
        chartFilter = await import('$lib/ChartFilter.svelte').then(
            ({ default: ChartFilter }) => ChartFilter
        )
        ;(await import('$lib/echartsInit')).chartInit()
        myChart = await import('echarts').then(({ init }) =>
            init(document.getElementById('chart') as HTMLDivElement, $theme, {
                renderer: 'svg'
            })
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
    <svelte:component
        this={chartFilter}
        {sensores}
        fn={chartDataToggle}
    />

    <div
        id="chart"
        class="w-full h-96 md:h-[500px]"
    />
</div>
