let myChart = echarts.init(document.getElementById('chart'), 'echarts-theme', { renderer: 'canvas' })

window.addEventListener('resize', () => {
	myChart.resize()
})

function legenda(alvo) {
	document.getElementById(alvo).classList.toggle('filtro__escondendo')
	myChart.dispatchAction({
		type: 'legendToggleSelect',
		name: alvo
	})
}

async function carregarDados(data) {
	myChart.showLoading({
		text: 'CARREGANDO DADOS',
		color: '#32c6efff',
		fontSize: 25,
		spinnerRadius: 30,
		fontWeigth: 'bold'
	})
	if (!data) {
		myChart.hideLoading()
		return alert('Selecione uma data')
	} else if (data == 'hoje') {
		//axios para buscar os dados do dia atual
		let response = await axios.get('https://labvirtual-api.vercel.app/api/hoje', { cors: true })

		if (!response.data) {
			myChart.hideLoading()
			return alert('Erro ao carregar dados')
		} else {
			let coeff = 1000 * 60 * 10 //Ultimo numero é o numero minutos da para cada atualização do grafico
			let date = new Date()
			let rounded = new Date(Math.ceil(date.getTime() / coeff) * coeff + 10) //Ultimo numero é o delay para compensar atrasos no BD(em ms)
			setTimeout(() => {
				carregarDados('hoje')
			}, rounded - date)
			criarGrafico(response.data)
		}
	} else {
		if (document.getElementById('tutorial') != null) document.getElementById('tutorial').style.display = 'none'
		//axios para buscar os dados do dia
		let response = await axios.get(`https://labvirtual-api.vercel.app/api/${data}`, { cors: true })

		if (!response.data) {
			myChart.hideLoading()
			return alert('Erro ao carregar dados')
		} else return criarGrafico(response.data)
	}
}

function criarGrafico(dados) {
	myChart.setOption({
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			right: 60,
			show: true
		},
		legend: {
			show: false
		},
		title: {
			text: `Gráfico do dia ${dados._id}`
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: dados.hora
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name: 'Umidade do sensor A',
				type: 'line',
				data: dados.sensor.A.Umidade
			},
			{
				name: 'Umidade do sensor B',
				type: 'line',
				data: dados.sensor.B.Umidade
			},
			{
				name: 'Condutividade do sensor A',
				type: 'line',
				data: dados.sensor.A.Condutividade
			},
			{
				name: 'Condutividade do sensor B',
				type: 'line',
				data: dados.sensor.B.Condutividade
			},
			{
				name: 'Temperatura do sensor A',
				type: 'line',
				data: dados.sensor.A.Temperatura
			},
			{
				name: 'Temperatura do sensor B',
				type: 'line',
				data: dados.sensor.B.Temperatura
			}
		]
	})
	myChart.hideLoading()
}
