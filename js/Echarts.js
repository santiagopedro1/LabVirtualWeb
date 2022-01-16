let request = new XMLHttpRequest();
request.open("GET", "data/dados.json", false);
request.send(null)
let dados = JSON.parse(request.responseText);

let option = {
  title: {
    text: `Gráfico dia ${new Date().toLocaleDateString()}`
  },
  tooltip:{
    trigger: 'axis',
  },
  legend: {
    data: [`${Object.keys(dados.sensor.A)[0]} do sensor ${Object.keys(dados.sensor)[0]}`, `${Object.keys(dados.sensor.B)[0]} do sensor ${Object.keys(dados.sensor)[1]}`, `${Object.keys(dados.sensor.A)[1]} do sensor ${Object.keys(dados.sensor)[0]}`, `${Object.keys(dados.sensor.B)[1]} do sensor ${Object.keys(dados.sensor)[1]}`, `${Object.keys(dados.sensor.A)[2]} do sensor ${Object.keys(dados.sensor)[0]}`, `${Object.keys(dados.sensor.B)[2]} do sensor ${Object.keys(dados.sensor)[1]}`]
  },
  xAxis: {
    name: 'Horário',
    type: 'category',
    boundaryGap: false,
    data: dados.hora
  },
  yAxis:{
    type: 'value',
  },
  series: [
    {
      name: `${Object.keys(dados.sensor.A)[0]} do sensor ${Object.keys(dados.sensor)[0]}`,
      type: 'line',
      data: dados.sensor.A.Umidade,
    },
    {
      name: `${Object.keys(dados.sensor.A)[0]} do sensor ${Object.keys(dados.sensor)[1]}`,
      type: 'line',
      data: dados.sensor.B.Umidade,
    },
    {
      name: `${Object.keys(dados.sensor.A)[1]} do sensor ${Object.keys(dados.sensor)[0]}`,
      type: 'line',
      data: dados.sensor.A.Conductividade,
    },
    {
      name: `${Object.keys(dados.sensor.A)[1]} do sensor ${Object.keys(dados.sensor)[1]}`,
      type: 'line',
      data: dados.sensor.B.Conductividade,
    },
    {
      name: `${Object.keys(dados.sensor.A)[2]} do sensor ${Object.keys(dados.sensor)[0]}`,
      type: 'line',
      data: dados.sensor.A.Temperatura,
    },
    {
      name: `${Object.keys(dados.sensor.A)[2]} do sensor ${Object.keys(dados.sensor)[1]}`,
      type: 'line',
      data: dados.sensor.B.Temperatura,
    },
  ]
}

window.addEventListener('resize', () => {myChart.resize()}) 

let myChart = echarts.init(document.getElementById('main'), 'echarts-theme', {renderer: 'svg'});
myChart.setOption(option);