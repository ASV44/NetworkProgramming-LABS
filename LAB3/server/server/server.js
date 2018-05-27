import config from './config'
import util from 'util'
import Imap from './imap'
import Smtp from './smtp'
import cors from 'cors'
import jwt from 'jsonwebtoken'

export default class Server {
  constructor(app) {
    this.app = app()
    this.router = app.Router()
    this.app.use(cors())
    this.app.use(app.json())
    this.createBasicRoutes()
    this.start()

    this.users = {}

    this.imap = new Imap()
    this.smtp = new Smtp('grupafaf151@gmail.com', 'GRUPAFAF151ABCD')
    // this.smtp.send({
    //   to: 'vdovicenco.alexandr@gmail.com', // list of receivers
    //   // cc: ,
    //   subject: 'Hello ✔', // Subject line
    //   text: 'Hello world?', // plain text body
    //   html: '<b>Hello world?</b>' // html body
    // })
  }

  start() {
    this.app.listen(config.port, () => {
      console.log('Application is running on port ' + config.port)
    })
  }

  createBasicRoutes() {
    this.router.get('/', (req, res) => {
      res.send('Hi, this is the Custom Email client')
    })

    this.router.post('/login', (req, res) => {
      let token = jwt.sign(req.body, 'shhhhh')
      this.users[token] = req.body
      res.send({
        token: token
      })
    })

    this.app.use('/api/v1', this.router)
  }
}
