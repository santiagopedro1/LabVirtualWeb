// TODO: Fazer isso aqui funcionar


async function getData(){

   const response = await fetch('DADOS.csv');
   const data = await response.text();
   const tempo = []
   const Umidadecomp = []
   const Conducomp = []
   const Tempcomp = []
   const Umidadesem = []
   const Condusem = []
   const Tempsem = []
   const linhas = data.split('\n').slice(1)
   linhas.forEach(linhas => {
       const colunas = linhas.split(';')
       tempo.push(colunas[0])
       Umidadecomp.push(colunas[1])
       Conducomp.push(colunas[2])
       Tempcomp.push(colunas[3])
       Umidadesem.push(colunas[4])
       Condusem.push(colunas[5])
       Tempsem.push(colunas[6])
   })
   return{tempo, Umidadecomp, Conducomp,Tempcomp, Umidadesem, Condusem, Tempsem}
}




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
                       data: elemnts.Umidadecomp,
                       borderColor: 'blue',
                       backgroundColor: 'blue',
                       borderWidth: 1,
                   },
                   {
                       label: 'Sem palha',
                       data: elemnts.Umidadesem,
                       borderColor: 'red',
                       backgroundColor: 'red',
                       borderWidth: 1,
                   }
               ]
           },
           options:{
               maintainAspectRatio: false,
               plugins:{
                   title: {
                   display: true,
                   text:  'Gráfico da Umidade',
                   color: '#0A0A0aff', 
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



window.addEventListener('load', setup);
async function setup(){
const ctx = document.getElementById('graficoCondu').getContext('2d')
const elemnts = await getData()
const graph = new Chart(ctx, {
   type: 'line',
   data:{
       labels: elemnts.tempo,
       datasets:[
           {
               label: 'Com palha',
               data: elemnts.Conducomp,
               borderColor: 'blue',
               backgroundColor: 'blue',
               borderWidth: 1,
           },
           {
               label: 'Sem palha',
               data: elemnts.Condusem,
               borderColor: 'red',
               backgroundColor: 'red',
               borderWidth: 1,
           }
       ]
   },
   options:{
       maintainAspectRatio: false,
       plugins:{
           title: {
           display: true,
           text:  'Gráfico da Conductividade',
           color: '#0A0A0aff',
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



window.addEventListener('load', setup);
async function setup(){
const ctx = document.getElementById('graficoTemperatura').getContext('2d')
const elemnts = await getData()
const graph = new Chart(ctx, {
   type: 'line',
   data:{
       labels: elemnts.tempo,
       datasets:[
           {
               label: 'Com palha',
               data: elemnts.Tempcomp,
               borderColor: 'blue',
               backgroundColor: 'blue',
               borderWidth: 1,
           },
           {
               label: 'Sem palha',
               data: elemnts.Tempsem,
               borderColor: 'red',
               backgroundColor: 'red',
               borderWidth: 1,
           }
       ]
   },
   options:{
       maintainAspectRatio: false,
       plugins:{
           title: {
           display: true,
           text:  'Gráfico da Temperatura',
           color: '#0A0A0aff',
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
