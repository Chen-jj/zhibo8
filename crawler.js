const request = require('request-promise')
const cheerio = require('cheerio')

const lv1 = ['阿森纳', '曼联', '曼彻斯特联', '切尔西', '利物浦', '热刺', '曼城', '曼彻斯特城', '恒大', '中国男足', '国足', '世界杯', '欧洲杯', '联合会杯', 'F1', 'f1']
const giants = ['皇马','皇家马德里','巴萨','巴塞','马竞','马德里竞技','拜仁','多特','尤文','AC','国米','国际米兰','罗马','那不勒斯','巴黎','摩纳哥',
				'英国','法国','德国','西班牙','意大利','葡萄牙','比利时','巴西','阿根廷','智利','墨西哥','乌拉圭','哥伦比亚','日本','韩国','科特迪瓦']
const Chinese_team = ['山东','上海','广州','江苏','北京','贵州','大连']

function crawler() {
	return request({
		url: 'https://www.zhibo8.cc'
	})
	.then(body => {
		return cheerio.load(body)
	})
	.then($ => {
		let list = $('.schedule_container .box .content li')
		.filter((i, el) => {
			// 过滤非重要赛事
			if (!$('b', el).length)
				return false;

			const text = $(el).text();

			// 只要出现，无论什么比赛，必提示
			for (let item of lv1) {
				if (text.indexOf(item) > -1) return true
			}

			// 其他：强队对碰才通知
			for (let item of giants) {
				if (text.indexOf(item) > -1) {
					for (let competitor of giants) {
						if (competitor === item) continue
						if (text.indexOf(competitor) > -1) return true
					}
				}
			}

			// 亚冠：含有中国球队才通知
			if (text.indexOf('亚冠') > -1 || text.indexOf('亚洲冠军') > -1) {
				for (item of Chinese_team) {
					if (text.indexOf(item) > -1) return true
				}
			}

			return false
		})

		return {$, list}
	})
	.then(obj => {
		let {$, list} = obj,
			matches = []

		list.each((i, el) => {
			matches.push({
				time:    $(el).attr('data-time'),
				against: $('b', el).text(),
				live:    $('a', el).eq(0).text()
			})
		})
		return matches
	})
}

module.exports = crawler