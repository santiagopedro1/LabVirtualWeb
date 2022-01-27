const myChart = echarts.init(document.getElementById('chart'), 'echarts-theme', { renderer: 'svg' })

fetch(`https://labvirtualapi.loca.lt/?_id=${new Date().toLocaleDateString('pt-BR')}`, { method: 'GET' }).then((res) => {
	return res.json().then((dados) => {
		let option = {
			title: {
				text: `Gráfico dia ${new Date().toLocaleDateString('pt-BR')}`,
			},
			tooltip: {
				trigger: 'axis',
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
					name: 'A',
					type: 'line',
					data: dados.distanciaA,
				},
				{
					name: 'B',
					type: 'line',
					data: dados.distanciaB,
				},
			],
		}
		myChart.setOption(option)
	})
})

const getData = () => {
	var d = new Date()
	h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - (d.getMinutes() % 15) + 15, 0, 0)
	e = h - d
	window.setTimeout(getData, e)

	fetch(`https://labvirtualapi.loca.lt/?_id=${new Date().toLocaleDateString('pt-BR')}`, { method: 'GET' }).then((res) => {
		return res.json().then((dados) => {
			myChart.setOption({
				xAxis: {
					data: dados.hora,
				},
				series: [
					{
						name: 'A',
						data: dados.distanciaA,
					},
					{
						name: 'B',
						data: dados.distanciaB,
					},
				],
			})
			console.log(new Date().toLocaleTimeString('pt-BR') + ' cheguei')
		})
	})
}

window.addEventListener('resize', () => {
	myChart.resize()
})
