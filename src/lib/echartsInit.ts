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

const LightTheme = {
    color: ['#FDBF6F', '#B2DF8A', '#FB9A99', '#FF7F00', '#33A02C', '#E31A1C'],
    textStyle: {
        color: '#000000',
        fontSize: 16
    },
    title: {
        left: 'center',
        textStyle: {
            color: '#000000',
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
                color: '#000000'
            }
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: '#000000'
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
                color: '#000000'
            }
        },
        axisTick: {
            lineStyle: {
                color: '#000000'
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
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        formatter: (data: any) => {
            const header = `<span style = 'padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid black; display: block; font-weight: 900'>${data[0].name}</span>`
            let dadosA = `<span style = 'font-weight: 900'>Sensor A:</span> </br>`
            let dadosB = `<span style = 'font-weight: 900'>Sensor B:</span> </br>`
            const Total = data.length
            data.forEach((item: any, index: number) => {
                let formattedValue = Object.values(item.value)[
                    (index % 3) + 1
                ] as any
                if (isNaN(formattedValue)) formattedValue = 'Sem leitura'
                if (item.seriesName.includes('Temperatura'))
                    formattedValue += 'ºC'
                else if (item.seriesName.includes('Umidade'))
                    formattedValue += '%'

                if (index < Total / 2)
                    dadosA += `${item.marker}${item.seriesName}: <b>${formattedValue}</b></br>`
                else
                    dadosB += `${item.marker}${item.seriesName}: <b>${formattedValue}</b></br>`
            })
            return header + dadosA + dadosB
        },
        textStyle: {
            color: '#1c1917',
            fontSize: 16
        },
        axisPointer: {
            lineStyle: {
                color: '#2222',
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
                    borderColor: '#000000'
                }
            }
        }
    }
}

const DarkTheme = {
    ...LightTheme,
    textStyle: {
        color: '#ffffff',
        fontSize: 16
    },
    title: {
        left: 'center',
        textStyle: {
            color: '#ffffff',
            fontSize: 24
        }
    },
    categoryAxis: {
        axisLine: {
            show: true,
            lineStyle: {
                color: '#ffffff'
            }
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: '#ffffff'
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
                color: '#ffffff'
            }
        },
        axisTick: {
            lineStyle: {
                color: '#ffffff'
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
        backgroundColor: '#262626',
        formatter: (data: any) => {
            const header = `<span style = 'padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid white; display: block; font-weight: 900'>${data[0].name}</span>`
            let dadosA = `<span style = 'font-weight: 900'>Sensor A:</span> </br>`
            let dadosB = `<span style = 'font-weight: 900'>Sensor B:</span> </br>`
            const Total = data.length
            data.forEach((item: any, index: number) => {
                let formattedValue = Object.values(item.value)[
                    (index % 3) + 1
                ] as any
                if (isNaN(formattedValue)) formattedValue = 'Sem leitura'
                if (item.seriesName.includes('Temperatura'))
                    formattedValue += 'ºC'
                else if (item.seriesName.includes('Umidade'))
                    formattedValue += '%'

                if (index < Total / 2)
                    dadosA += `${item.marker}${item.seriesName}: <b>${formattedValue}</b></br>`
                else
                    dadosB += `${item.marker}${item.seriesName}: <b>${formattedValue}</b></br>`
            })
            return header + dadosA + dadosB
        },
        textStyle: {
            color: '#fffff',
            fontSize: 16
        },
        axisPointer: {
            lineStyle: {
                color: '#eeeeee',
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
                    borderColor: '#ffffff'
                }
            }
        }
    }
}

export default function chartInit() {
    registerTheme('light', LightTheme)
    registerTheme('dark', DarkTheme)

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
