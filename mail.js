const mailer  = require('nodemailer')

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
	subject: 'hello',
	html: '<h1>hello world!</h1>'
}

transporter.sendMail(mailOptions, (error, info) => {
	if (error) return console.log(error)

	console.log('Message %s sent: %s', info.messageId, info.response);
})