import config from './config'
import net from 'net'

export default class Client {
  constructor() {
    this.start()
  }

  start() {
    let client = net.connect({port: config.port}, () => {
       console.log('connected to server!')
    })
    client.on('data', (data) => {
       console.log(data.toString())
       //client.end()
    })
    client.on('end', () => {
       console.log('disconnected from server')
    })


    let stdin = process.openStdin();

    stdin.addListener("data", (data) => {
      client.write(data.toString().trim())
    })
  }
}
