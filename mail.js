const mailer  = require('nodemailer')

function mail(html) {
	let transporter = mailer.createTransport({
		host: 'smtp.163.com',
		port: 465,
		secure: true,
		auth: {
			user: '18588860103@163.com',
			pass: 'chenjj68'
		}
	})

	let mailOptions = {
		from: '18588860103@163.com',
		to: '798095202@qq.com',
		subject: '比赛预告',
		html
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) return console.log(error)

		console.log('Message %s sent: %s', info.messageId, info.response)
	})
}

module.exports = mail