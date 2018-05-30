import nodemailer from 'nodemailer'

export default class Smtp {
  constructor(user = '', password = '', host = 'smtp.gmail.com') {
    this.transporter = nodemailer.createTransport({
        host: host,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: user,
            pass: password
        }
    })

    this.transporter.verify(function(error, success) {
       if (error) {
            console.log(error)
       } else {
            console.log('Server is ready to take our messages')
       }
    })
  }

  send(mailOptions) {
    // send mail with defined transport object
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
            reject(error)
          } else {
            console.log('Message sent to: %s', mailOptions.to)
            resolve(mailOptions)
          }
      })
    })
  }

  getUser() {
    return this.transporter.options.auth.user
  }
}
