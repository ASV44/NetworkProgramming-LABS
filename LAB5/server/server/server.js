import config from './config'
import net from 'net'

export default class Server {
  constructor() {
    this.start()
  }

  start() {
    let tcpServer = net.createServer(this.onClientConnected.bind(this))

    tcpServer.listen(config.port, () => {
      console.log('Application is running on port ' + config.port)
    })
  }

  onClientConnected(client) {
    console.log('client connected')

    client.on('data', this.processRequest)

    client.on('end', () => {
       console.log('client disconnected')
    })
      //client.pipe(client)
  }

  processRequest(data) {
    console.log(data.toString())
    if(config.commands.hasOwnProperty(data.toString())) {
      
    }
  }
}
