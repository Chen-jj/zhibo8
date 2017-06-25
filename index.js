const moment  = require('moment')
const mail    = require('./mail')
const crawler = require('./crawler')

const AN_HOUR = 60*60*1000

function howMuchToCrawl(today) {
	let end = null

	if (today === 'Monday') {
		// 东八区时间，下周一6点
		end = moment().utcOffset(8).startOf('day').add(7, 'days').add(6, 'hours')
	} else if (today === 'Friday') {
		// 东八区时间，这周一6点
		end = moment().utcOffset(8).startOf('day').add(3, 'days').add(6, 'hours')
	}
	console.log('end: ' + end.format())

	crawler().then(matches => {
		return matches.filter(item => {
			let matchTime = moment(item.time).subtract(12, 'hours').utcOffset(8)
			// let matchTime = moment(item.time).utcOffset(8) // 调试用
			return matchTime.isSameOrBefore(end)
		})
	})
	.then(matches => {
		return matches.map(item => {
			moment.locale('zh-cn')
			let matchTime = moment(item.time).subtract(12, 'hours').utcOffset(8).calendar()
			// let matchTime = moment(item.time).utcOffset(8).calendar() // 调试用
			console.log(matchTime, item.against);
			return `<div style="margin-bottom: 15px;"><h3 style="margin:0;font-size:20px;"><span style="margin-right: 10px;">${matchTime}</span>${item.against}</h3><p style="margin: 0;">${item.live}</p></div>`
		}).reduce((prev, cur) => prev + cur)
	})
	.then(text => {
		mail(text)
	})
	.then(() => {
		let delay = 0;
		if (today === 'Monday')
			delay = 5*24*AN_HOUR
		else
			delay = 3*24*AN_HOUR

		setTimeout(loop, delay)
	})
}


function loop() {
	const day = moment().utcOffset(8).day()

	if (day === 1) {
		howMuchToCrawl('Monday');
	} else if (day === 5) {
		howMuchToCrawl('Friday');
	} else {// 从部署时间开始计起，每10小时尝试走一次逻辑
		console.log('loop', moment().format());
		setTimeout(loop, 10*AN_HOUR)
	}
}



loop()