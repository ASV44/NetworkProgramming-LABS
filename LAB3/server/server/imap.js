import imap from 'imap'
import util from 'util'
import xoauth2 from 'xoauth2'

export default class Imap {
  constructor() {

    this.imap = new imap({
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    })
  }

  setUser(config) {
    this.imap._config.user = config.user
    this.imap._config.password = config.password
  }

  imapRequest() {
    let inspect = util.inspect
    this.imap.once('ready', () => {
      this.imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err
        var f = this.imap.seq.fetch('1:*', {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)'
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
              console.log(prefix + 'Parsed header: %s', inspect(imap.parseHeader(buffer)))
            })
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
