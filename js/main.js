let myChart = echarts.init(document.getElementById('chart'), 'echarts-theme', { renderer: 'svg' })

window.addEventListener('resize', () => {
	myChart.resize()
})

function legenda(alvo) {
	document.getElementById(alvo).classList.toggle('filtro__escondendo')
	myChart.dispatchAction({
		type: 'legendToggleSelect',
		name: alvo,
	})
}

function trigger(data) {
	if (data) {
		carregarDados(data.replace(/\//g, '%2f'))
		document.getElementById('tutorial').style.display = 'none'
	} else {
		carregarDados('hoje')
		let d = new Date()
		h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - (d.getMinutes() % 10) + 10, 10, 0)
		e = h - d
		setInterval(() => {
			carregarDados('hoje')
		}, e)
	}
}

function carregarDados(data) {
	myChart.showLoading({
		text: 'CARREGANDO DADOS',
		color: '#32c6efff',
		fontSize: 25,
		spinnerRadius: 30,
		fontWeigth: 'bold',
	})

	fetch(`https://labvirtual-api.vercel.app/api/${data}`, { method: 'GET', mode: 'cors' }).then((res) => {
		return res.json().then((dados) => {
			criarGrafico(dados)
		})
	})
}

//functions

//criar gráfico
function criarGrafico(dados) {
	myChart.setOption({
		tooltip: {
			trigger: 'axis',
		},
		toolbox: {
			right: 60,
			show: true,
		},
		legend: {
			show: false,
		},
		title: {
			text: `Gráfico do dia ${dados._id}`,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: dados.hora,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: 'Umidade do sensor A',
				type: 'line',
				data: dados.sensor.A.Umidade,
			},
			{
				name: 'Umidade do sensor B',
				type: 'line',
				data: dados.sensor.B.Umidade,
			},
			{
				name: 'Conductividade do sensor A',
				type: 'line',
				data: dados.sensor.A.Conductividade,
			},
			{
				name: 'Conductividade do sensor B',
				type: 'line',
				data: dados.sensor.B.Conductividade,
			},
			{
				name: 'Temperatura do sensor A',
				type: 'line',
				data: dados.sensor.A.Temperatura,
			},
			{
				name: 'Temperatura do sensor B',
				type: 'line',
				data: dados.sensor.B.Temperatura,
			},
		],
	})
	myChart.hideLoading()
}
