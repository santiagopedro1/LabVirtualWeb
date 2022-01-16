// Globais
window.Apex = {
  colors:["#ff355e", "#50bfe6", "#ff6037", "#009900", "#ffff66", "#ff00cc"],
  title:{
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
    crosshairs:{
			stroke: {
				color: 'gray',
			}
    },
    labels:{
      rotate: 0,
      hideOverlappingLabels: true
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
    show: false
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
      animateGradually:{
				enabled: false
			}
    }
  },
  noData:{
    text:'Sem dados'
  }
}
//------fim globais---------------------------------------------------------------------------

let request = new XMLHttpRequest();
request.open("GET", "data/dados.json", false);
request.send(null)
let dados = JSON.parse(request.responseText);

// chart #1
let options = {
  title: {
   text: `Gráfico da umidade do dia ${new Date().toLocaleDateString()}`,
  },
chart:{
    type: 'line'
  },
  series: [
    {
      name: 'Umidade com palha',
      data: dados.sensor.A.Umidade
    },
    {
      name: 'Umidade sem palha',
      data: dados.sensor.B.Umidade
    },
    {
      name: 'Conductividade com palha',
      data: dados.sensor.A.Conductividade
    },
    {
      name: 'Conductividade sem palha',
      data: dados.sensor.B.Conductividade
    },
    {
      name: 'Temperatura com palha',
      data: dados.sensor.A.Temperatura
    },
    {
      name: 'Temperatura sem palha',
      data: dados.sensor.B.Temperatura
    }
  ],
  xaxis: {
    categories: dados.hora
  }
}
window.chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render()
options.series.forEach(element => {
  chart.toggleSeries(`${element.name}`)
});

function filtrar(tipo) {
  chart.toggleSeries(`${tipo}`)
}
