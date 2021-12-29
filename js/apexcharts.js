// Globais
window.Apex = {
    colors:['#ee204d', '#00bbf9'],
    title:{
        margin: -20,
        offsetY: 15,
        align: 'center',
        style:{
            fontSize: 20,
            color: '#1b1b1b'
        }
    },
    stroke:{
        width: 3
    },
    markers:{
        size: 5,
        strokeWidth: 0,
        hover:{
            sizeOffset: 2
        }
    },
    grid:{
        borderColor: '#cccccc',
    },
    xaxis:{
        tickAmount: 20,
        crosshairs:{
            opacity: 1
        },
        labels:{
            hideOverlappingLabels: true,
        },
        axisBorder:{
            color: 'black'
        },
        axisTicks:{
            color: 'black'
        },
        tooltip:{
            enabled: false
        }
    },
    legend:{
        position: 'top',
        fontSize: 16,
    },
    tooltip:{
        followCursor: true
    },
    chart:{
        height: 450,
        width: '100%',
        toolbar:{
            offsetY: 15,
            tools:{
                zoomin: false,
                zoomout: false,
                pan: false,
            }
        },
        animations:{
            easing: 'linear',
            animateGradually: false
        }
    }
}



window.addEventListener('load', setupAPEX)
async function setupAPEX(){
    const elemnts = await getData()
    var options = {
        title: {
        text: 'Gráfico da umidade',
        },

    chart:{
            type: 'line'
        },
        series: [
            {
            name: 'Umidade com palha',
            data: elemnts.A_Umidade
        },
        {
            name: 'Umidade sem palha',
            data: elemnts.B_Umidade
        }
        ],
        xaxis: {
            categories: elemnts.tempo
        }
    }

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
}

window.addEventListener('load', setupAPEX2)
async function setupAPEX2(){
    const elemnts = await getData()
    var options = {
    title: {
        text: 'Gráfico da conductividade',
        },
        yaxis:{
            min: 0,
            forceNiceScale: true
        },
    chart:{
        type: 'line'
        },
    series: [
        {
        name: 'Conductividade com palha',
        data: elemnts.A_Conductividade
        },
        {
        name: 'Conductividade sem palha',
        data: elemnts.B_Conductividade
        }
        ],
        xaxis: {
            categories: elemnts.tempo
        }
    }

    var chart2 = new ApexCharts(document.querySelector("#chart2"), options);

    chart2.render();
}

window.addEventListener('load', setupAPEX3)
async function setupAPEX3(){
    const elemnts = await getData()
    var options = {
        title: {
        text: 'Gráfico da temperatura',
        },

    chart:{
            type: 'line'
        },
        series: [
            {
            name: 'Temperatura com palha',
            data: elemnts.A_Temperatura
        },
        {
            name: 'Temperatura sem palha',
            data: elemnts.B_Temperatura
        }
        ],
        xaxis: {
            categories: elemnts.tempo
        }
    }

    var chart3 = new ApexCharts(document.querySelector("#chart3"), options);

    chart3.render();
}



// Fetch
async function getData(){

    const response = await fetch('/data/sensors_data.csv');
    const data = await response.text();
    let tempo = []
    let A_Umidade = []
    let A_Conductividade = []
    let A_Temperatura = []
    let B_Umidade = []
    let B_Conductividade = []
    let B_Temperatura = []
    let linhas = data.split('\n').slice(1)
    linhas.forEach(linhas => {
        const colunas = linhas.split(',')
        tempo.push(colunas[0])
        A_Umidade.push(colunas[1])
        A_Conductividade.push(colunas[2])
        A_Temperatura.push(colunas[3])
        B_Umidade.push(colunas[4])
        B_Conductividade.push(colunas[5])
        B_Temperatura.push(colunas[6])
    })

    A_Umidade = A_Umidade.map(Number)
    A_Conductividade = A_Conductividade.map(Number)
    A_Temperatura = A_Temperatura.map(Number)
    B_Umidade = B_Umidade.map(Number)
    B_Conductividade = B_Conductividade.map(Number)
    B_Temperatura = B_Temperatura.map(Number)

    return{tempo, A_Umidade, A_Conductividade,A_Temperatura, B_Umidade, B_Conductividade, B_Temperatura}
 }