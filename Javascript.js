// TODO: Fazer isso aqui funcionar
window.addEventListener('load', setup);
async function setup(){
    const ctx = document.getElementById('graficoUmidade').getContext('2d')
    const elemnts = await getData()
    const graph = new Chart(ctx, {
        type: 'line',
        data:{
            labels: elemnts.tempo,
            datasets:[
                {
                    label: 'Com palha',
                    data: elemnts.A_Umidade,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    borderWidth: 2
                },
                {
                    label: 'Sem palha',
                    data: elemnts.B_Umidade,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    borderWidth: 2,
                }
            ]
        },
        options:{
            spanGaps: true,
            animation: false,
            maintainAspectRatio: false,
            plugins:{
                crosshair:{
                    line: {
                        color: '#1b1b1b'
                    },
                    snap:{
                        enabled: true
                    }
                },
                title: {
                display: true,
                text:  'Gráfico da Umidade',
                color: 'black', 
                font: {
                    size: 20
                }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
 },
})
}


window.addEventListener('load', setup2);
    async function setup2(){
        const ctx2 = document.getElementById('graficoCondu').getContext('2d')
        const elemnts = await getData()
        const graph = new Chart(ctx2, {
            type: 'line',
            data:{
                labels: elemnts.tempo,
                datasets:[
                    {
                        label: 'Com palha',
                        data: elemnts.A_Conductividade,
                        borderColor: 'blue',
                        backgroundColor: 'blue',
                        borderWidth: 2,
                    },
                    {
                        label: 'Sem palha',
                        data: elemnts.B_Conductividade,
                        borderColor: 'red',
                        backgroundColor: 'red',
                        borderWidth: 2,
                    }
                ]
            },
            options:{
                spanGaps: true,
                animation: true,
                maintainAspectRatio: false,
                plugins:{
                    crosshair:{
                        line: {
                            color: '#1b1b1b'
                        },
                        snap: {
                            enabled: true
                        }
                    },
                    title: {
                    display: true,
                    text:  'Gráfico da Conductividade',
                    color: 'black',
                    font: {
                            size: 20
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
     },
})
}

window.addEventListener('load', setup3);
async function setup3(){
    const ctx3 = document.getElementById('graficoTemperatura').getContext('2d')
    const elemnts = await getData()
    const graph = new Chart(ctx3, {
        type: 'line',
        data:{
            labels: elemnts.tempo,
            datasets:[
                {
                    label: 'Com palha',
                    data: elemnts.A_Temperatura,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    borderWidth: 2,
                },
                {
                    label: 'Sem palha',
                    data: elemnts.B_Temperatura,
                    borderColor: 'red',
                    backgroundColor: 'red',
                    borderWidth: 2,
                }
            ]
        },
        options:{
            spanGaps: true,
            animation:false,
            maintainAspectRatio: false,
            plugins:{
                crosshair:{
                    line: {
                        color: '#1b1b1b'
                    },
                    snap:{
                        enabled: true
                    }
                },
                title: {
                display: true,
                text:  'Gráfico da Temperatura',
                color: 'black',
                font: {
                        size: 20
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
 },
})
}


async function getData(){

   const response = await fetch('sensors_data.csv');
   const data = await response.text();
   const tempo = []
   const A_Umidade = []
   const A_Conductividade = []
   const A_Temperatura = []
   const B_Umidade = []
   const B_Conductividade = []
   const B_Temperatura = []
   const linhas = data.split('\n').slice(1)
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
   return{tempo, A_Umidade, A_Conductividade,A_Temperatura, B_Umidade, B_Conductividade, B_Temperatura}
}