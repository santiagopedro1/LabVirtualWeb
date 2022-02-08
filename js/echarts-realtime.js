const myChart = echarts.init(document.getElementById('chart'), 'echarts-theme', { renderer: 'svg' })

const header = new Headers({
	'Content-Type': 'text/plain',
	'Bypass-Tunnel-Reminder': 1,
})

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
		data: [],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: 'A',
			type: 'line',
			data: [],
		},
		{
			name: 'B',
			type: 'line',
			data: [],
		},
	],
}
myChart.setOption(option)

const getData = () => {
	let d = new Date()
	h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - (d.getMinutes() % 15) + 15, 2, 0)
	e = h - d
	window.setTimeout(getData, e)

	fetch(`https://apilabvirtual.loca.lt/?_id=${new Date().toLocaleDateString('pt-BR')}`, { method: 'GET', headers: header }).then((res) => {
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
			let x = new Date()
			console.log(`cheguei ${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}.${x.getMilliseconds()}`)
		})
	})
}

window.addEventListener('resize', () => {
	myChart.resize()
})
