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

function fetchdata() {
	let data = document.getElementById('date-picker').value

	document.getElementById('tutorial').style.display = 'none'

	myChart.showLoading({
		text: 'CARREGANDO DADOS',
		color: '#32c6efff',
		fontSize: 25,
		spinnerRadius: 30,
		fontWeigth: 'bold',
	})
	let option = {
		title: {
			text: `Gráfico do dia ${data}`,
		},
		tooltip: {
			trigger: 'axis',
		},
		toolbox: {
			right: 60,
			show: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
		},
		legend: {
			show: false,
		},
		series: [
			{
				name: 'Umidade do sensor A',
				type: 'line',
				data: [],
			},
			{
				name: 'Umidade do sensor B',
				type: 'line',
				data: [],
			},
			{
				name: 'Conductividade do sensor A',
				type: 'line',
				data: [],
			},
			{
				name: 'Conductividade do sensor B',
				type: 'line',
				data: [],
			},
			{
				name: 'Temperatura do sensor A',
				type: 'line',
				data: [],
			},

			{
				name: 'Temperatura do sensor B',
				type: 'line',
				data: [],
			},
		],
	}

	myChart.setOption(option)

	fetch(`https://labvirtual-api.vercel.app/api/${data.replace(/\//g, '%2f')}`, { method: 'POST' }).then((res) => {
		myChart.hideLoading()
		return res.json().then((dados) => {
			myChart.setOption({
				xAxis: {
					data: dados.hora,
				},
				series: [
					{
						name: 'Umidade do sensor A',
						data: dados.sensor.A.Umidade,
					},
					{
						name: 'Umidade do sensor B',
						data: dados.sensor.B.Umidade,
					},
					{
						name: 'Conductividade do sensor A',
						data: dados.sensor.A.Conductividade,
					},
					{
						name: 'Conductividade do sensor B',
						data: dados.sensor.B.Conductividade,
					},
					{
						name: 'Temperatura do sensor A',
						data: dados.sensor.A.Temperatura,
					},
					{
						name: 'Temperatura do sensor B',
						data: dados.sensor.B.Temperatura,
					},
				],
			})
			myChart.hideLoading()
		})
	})
}
