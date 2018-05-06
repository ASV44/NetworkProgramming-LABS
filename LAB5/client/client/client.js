import config from './config'
import net from 'net'

export default class Client {
  constructor() {
    this.start()
  }

  start() {
    this.connectToServer()
    let stdin = process.openStdin();

    stdin.addListener("data", (data) => {
      this.client.write(data.toString().trim())
    })
  }

  connectToServer() {
    this.client = net.connect({port: config.port}, () => {
       console.log('connected to server!')
    })

    this.client.on('data', (data) => {
       console.log(data.toString())
       //client.end()
    })
    this.client.on('end', () => {
       console.log('disconnected from server')
       this.client.end()
       setTimeout(this.connectToServer.bind(this), 2000)
    })
  }
}
