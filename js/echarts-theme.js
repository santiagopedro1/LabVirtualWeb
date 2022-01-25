;(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['exports', 'echarts'], factory)
	} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
		// CommonJS
		factory(exports, require('echarts'))
	} else {
		// Browser globals
		factory({}, root.echarts)
	}
})(this, function (exports, echarts) {
	var log = function (msg) {
		if (typeof console !== 'undefined') {
			console && console.error && console.error(msg)
		}
	}
	if (!echarts) {
		log('ECharts is not Loaded')
		return
	}
	echarts.registerTheme('echarts-theme', {
		color: ['#ff355e', '#50bfe6', '#ff6037', '#13a013', '#ffff66', '#ff00cc'],
		backgroundColor: '#dcdcdc',
		textStyle: {
			fontSize: 16,
		},
		title: {
			left: 'center',
			textStyle: {
				fontWeigth: 'bolder',
				color: '#1b1b1b',
			},
			subtextStyle: {
				color: '#555555',
			},
		},
		legend: {
			top: 30,
			itemWidth: 10,
			textStyle: {
				color: '#2d2d2d',
			},
		},
		grid: {
			containLabel: true,
			left: 10,
			right: 30,
		},
		line: {
			lineStyle: {
				width: 3,
			},
			symbolSize: 10,
			symbol: 'none',
			smooth: false,
		},
		categoryAxis: {
			axisLine: {
				show: true,
				lineStyle: {
					color: '#000000',
				},
			},
			axisTick: {
				show: true,
				lineStyle: {
					color: '#000000',
				},
			},
			axisLabel: {
				fontSize: 15,
				show: true,
				color: '#000000',
			},
			splitLine: {
				show: false,
				lineStyle: {
					color: '#ccc',
				},
			},
		},
		valueAxis: {
			min: (value) => {
				if (Math.floor(value.min - 2) >= 0) return Math.floor(value.min - 2)
				else return 0
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#000000',
				},
			},
			axisTick: {
				lineStyle: {
					color: '#000000',
				},
			},
			axisLabel: {
				fontSize: 15,
				color: '#333',
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#ccc',
				},
			},
		},
		tooltip: {
			formatter: (params) => {
				let tooltipText = ''
				params.forEach((item) => {
					if (!item.value) item.value = 'Sem leitura'
					tooltipText += `${item.marker}${item.seriesName}: <b>${item.value}</b></br>`
				})
				return (
					`<span style = 'padding-bottom: 5px; margin-bottom: 5px; box-shadow: -11px 0px #ffffff, 11px 0px #ffffff, -11px 1px #808080, 11px 1px #808080; display: block; font-weight: bolder'>${params[0].name}</span>` +
					tooltipText
				)
			},
			textStyle: {
				color: '#262626',
			},
			axisPointer: {
				lineStyle: {
					color: '#3333',
					width: 2,
				},
			},
		},
		toolbox: {
			show: true,
			feature: {
				saveAsImage: {},
			},
		},
	})
})
