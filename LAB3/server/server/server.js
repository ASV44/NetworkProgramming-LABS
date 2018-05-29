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

    this.router.post('/send', (req, res) => {
      let decoded = jwt.decode(req.body.token)
      this.smtp = new Smtp(decoded.user, decoded.password)
      let send = this.smtp.send({
        to: req.body.toEmailAddresses, // list of receivers
        cc: req.body.ccEmailAddresses, // list of cc receivers
        subject: req.body.subject, // Subject line
        text: req.body.emailText // plain text body
      })

      send.then(options => {
        res.send({
          status: 'sent',
          options: options
        })
      }).catch(error => {
        res.status(400).send(error)
      })
    })

    this.app.use('/api/v1', this.router)
  }
}
