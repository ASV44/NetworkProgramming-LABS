import config from './config'
import net from 'net'

export default class Server {
  constructor(app) {
    this.app = app
    //this.createBasicRoute()
    this.start()
  }

  start() {
    // this.app.listen(config.port, () => {
    //   console.log('Application is running on port ' + config.port)
    // })

    //This server listens on TCP/IP port 1234
    var tcpServer = net.createServer((client) => {
        // Do something with the client connection
        console.log('client connected')

        client.on('end', () => {
           console.log('client disconnected')
        })
        client.write('Hello World!\r\n')
        client.pipe(client)
    })
    tcpServer.listen(config.port, () => {
      console.log('Application is running on port ' + config.port)
    });
  }

  createBasicRoute() {
    this.app.get('/api/v1', (req, res) => {
      res.send('Server Runs')
    })
  }
}
