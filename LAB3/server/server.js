import config from './config'
import Imap from 'imap'
import xoauth2 from 'xoauth2'
import util from 'util'

export default class Server {
  constructor(app) {
    this.app = app
    this.createBasicRoute()
    this.start()

    this.xoauth2gen = xoauth2.createXOAuth2Generator({
      user: 'vdovicenco.alexandr@gmail.com',
      clientId: '617254630464-50eqjadbh43mp61dgjv2iksfettrhftc.apps.googleusercontent.com',
      clientSecret: 'xzw2yUq5PYcU3v2A55gioAo-',
      refreshToken: '1/cXI75lCFo4CcLN6BZvSvxvulXVIag2ptHhMNm17i-LI'
    });



    this.xoauth2gen.getToken((err, token) => {
      if(err){
          return console.log(err)
      }
      console.log("AUTH XOAUTH2 " + token)
      this.imap = new Imap({
        //user: 'grupafaf151@gmail.com',
        xoauth2: token,
        //password: 'FAF151ABCD',
        host: 'imap.gmail.com',
        port: 993,
        tls: true
      })
      this.imapRequest()
    })


  }

  start() {
    this.app.listen(config.port, () => {
      console.log('Application is running on port ' + config.port)
    })
  }

  createBasicRoute() {
    this.app.get('/api/v1', (req, res) => {
      res.send('Hi, this is the Custom Email client')
    })
  }

  openInbox(cb) {
    this.imap.openBox('INBOX', true, cb);
  }

  imapRequest() {
    let inspect = util.inspect
    this.imap.once('ready', () => {
      this.openInbox((err, box) => {
        if (err) throw err
        var f = this.imap.seq.fetch('1:3', {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          struct: true
        })
        f.on('message', (msg, seqno) => {
          console.log('Message #%d', seqno)
          var prefix = '(#' + seqno + ') '
          msg.on('body', (stream, info) => {
            var buffer = ''
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8')
            })
            stream.once('end', () => {
              console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)))
            })
          })
          msg.once('attributes', (attrs) => {
            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8))
          })
          msg.once('end', () => {
            console.log(prefix + 'Finished')
          })
        })
        f.once('error', (err) => {
          console.log('Fetch error: ' + err)
        })
        f.once('end', () => {
          console.log('Done fetching all messages!')
          this.imap.end()
        })
      })
    })

    this.imap.once('error', (err) => {
      console.log(err)
    });

    this.imap.once('end', () => {
      console.log('Connection ended')
    });

    this.imap.connect();
  }
}
