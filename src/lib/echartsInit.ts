import { use, registerTheme } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    DatasetComponent,
    ToolboxComponent
} from 'echarts/components'

const colors = [
    '#c1232b',
    '#27727b',
    '#fcce10',
    '#e87c25',
    '#b5c334',
    '#fe8463',
    '#9bca63',
    '#fad860',
    '#f3a43b',
    '#60c0dd',
    '#d7504b',
    '#c6e579',
    '#f4e001',
    '#f0805a',
    '#26c0c0'
]

export const buildTheme = (theme: string) => {
    const isDark = theme === 'dark'
    return {
        color: colors,
        textStyle: {
            color: isDark ? '#ffffff' : '#000000',
            fontSize: 16
        },
        title: {
            left: 'center',
            textStyle: {
                color: isDark ? '#ffffff' : '#000000',
                fontSize: 24
            }
        },
        legend: {},
        grid: {
            containLabel: true,
            left: 35,
            right: 30
        },
        line: {
            lineStyle: {
                width: 3
            },
            symbol: 'none',
            smooth: false
        },
        categoryAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#737373'
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#737373'
                }
            },
            axisLabel: {
                fontSize: 16,
                show: true
            },
            //linha vertical do grid
            splitLine: {
                show: false
            }
        },
        valueAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#737373'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#737373'
                }
            },
            axisLabel: {
                fontSize: 16
            },
            //linha horizontal do grid
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#a6a6a6'
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDark ? '#262626' : '#ffffff',
            borderColor: isDark ? '#ffffff' : '#262626',
            formatter: (data: any) => {
                const header = `<span style = 'padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid ${
                    isDark ? 'white' : 'black'
                }; display: block; font-weight: 900'>${data[0].name}</span>`

                const numberOfSensors = new Set(
                    data.map((item: any) => item.seriesName.split('_')[0])
                ).size

                const dataMap = new Map(
                    Array.from({ length: numberOfSensors }, (_, i) => {
                        const sensorData = data.filter((item: any) =>
                            item.seriesName.includes(i + 1)
                        )
                        return [i + 1, sensorData]
                    })
                )

                let sensors = ''

                dataMap.forEach((value: any, key: number) => {
                    sensors += `<span style = 'font-weight: 900'>Sensor ${key}:</span> </br>`
                    value.forEach((item: any) => {
                        sensors += `${item.marker}${
                            item.seriesName.split('_')[1]
                        }: <b>${item.data[item.seriesName]}</b></br>`
                    })
                })

                return header + sensors
            },
            textStyle: {
                color: isDark ? '#fffff' : '#1c1917',
                fontSize: 16
            },
            axisPointer: {
                lineStyle: {
                    color: isDark ? '#eeeeee' : '#000',
                    width: 2
                }
            }
        },
        toolbox: {
            show: true,
            top: 25,
            feature: {
                saveAsImage: {
                    title: 'Salvar como imagem',
                    emphasis: {
                        iconStyle: {
                            borderColor: '#F7B100'
                        }
                    },
                    iconStyle: {
                        borderColor: isDark ? '#ffffff' : '#000000'
                    }
                }
            }
        }
    }
}

export function chartInit() {
    registerTheme('light', buildTheme('light'))
    registerTheme('dark', buildTheme('dark'))

    use([
        SVGRenderer,
        LineChart,
        GridComponent,
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        ToolboxComponent,
        DatasetComponent
    ])
}

// formatter: (data: any) => {
//                 const header = `<span style = 'padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid ${
//                     isDark ? 'white' : 'black'
//                 }; display: block; font-weight: 900'>${data[0].name}</span>`
//                 const attrMap = new Map()
//                 data.forEach((item: any) => {
//                     if (attrMap.has(item.seriesName.split('_')[0]))
//                         attrMap.set(
//                             item.seriesName.split('_')[0],
//                             attrMap.get(item.seriesName.split('_')[0]) + 1
//                         )
//                     else attrMap.set(item.seriesName.split('_')[0], 1)
//                 })

//                 let sensors = ''
//                 attrMap.forEach((value: number, key: string) => {
//                     sensors += `<span style = 'font-weight: 900'>Sensor ${key}:</span> </br>`
//                     for (let i = 0; i < value; i++) {
//                         const item = data.find((item: any) =>
//                             item.seriesName.includes(key)
//                         )
//                         if (item) {
//                             let formattedValue = Object.values(item.value)[
//                                 (i % attrMap.get(key)) + 1
//                             ] as any
//                             if (isNaN(formattedValue))
//                                 formattedValue = 'Sem leitura'
//                             sensors += `${item.marker}${
//                                 item.seriesName.split('_')[1]
//                             }: <b>${formattedValue}</b></br>`
//                             data.splice(data.indexOf(item), 1)
//                         }
//                     }
//                 })
//                 return header + sensors
//             },
