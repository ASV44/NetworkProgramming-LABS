import config from './config'
import net from 'net'
import DispatchHandler from './dispatchHandler'

export default class Server {
  constructor() {
    this.start()
    this.commands = {}
    this.registerCommands()
  }

  start() {
    let tcpServer = net.createServer(this.onClientConnected.bind(this))

    tcpServer.listen(config.port, () => {
      console.log('Application is running on port ' + config.port)
    })
  }

  addCommand(command, handle) {
    this.commands[command] = handle
  }

  registerCommands() {
    this.addCommand('/help', (data) => { this.dispatchHandler.help() })
    this.addCommand('/hello', (data) => { this.dispatchHandler.hello(data) })
    this.addCommand('/quote', (data) => { this.dispatchHandler.quote() })
    this.addCommand('/weather', (city) => { this.dispatchHandler.weather(city) })
    this.addCommand('/star', (data) => { this.dispatchHandler.star(data) })
  }

  onClientConnected(client) {
    console.log('client connected')

    this.dispatchHandler = new DispatchHandler(client)

    client.on('data', this.processRequest.bind(this))

    client.on('end', () => {
       console.log('client disconnected')
    })
      //client.pipe(client)
  }

  processRequest(data) {
    let tokens = data.toString().split(' ')
    let command = tokens.shift()
    if(this.commands.hasOwnProperty(command)) {
      this.commands[command](tokens)
    }
    else {
      this.dispatchHandler.error(command, tokens)
    }
  }
}
