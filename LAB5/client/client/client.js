import config from './config'
import net from 'net'
import fs from 'fs'

export default class Client {
  constructor() {
    this.start()
    this.handlers = {}
    this.createHandlers()
  }

  start() {
    this.connectToServer()
    let stdin = process.openStdin();

    stdin.addListener("data", (data) => {
      this.performRequest(data.toString().trim())
    })
  }

  addRequestHandler(command, handler) {
    this.handlers[command] = handler
  }

  createHandlers() {
    this.addRequestHandler('/getFile', (data) => { this.saveFile(data) })
  }

  connectToServer() {
    this.client = net.connect({port: config.port}, () => {
       console.log('connected to server!')
    })

    this.client.on('data', (data) => { this.handleServerResponse(data) })

    this.client.on('end', () => {
       console.log('disconnected from server')
       this.client.end()
       setTimeout(this.connectToServer.bind(this), 2000)
    })
  }

  performRequest(command) {
    this.handleServerResponse = this.handlers[command] !== undefined ? this.handlers[command]
                                                                     : this.defaultHandler
    this.client.write(command)
  }

  defaultHandler(data) {
    console.log(data.toString())
  }

  saveFile(data) {
    let dest = fs.createWriteStream(__dirname + '/../resources/client_faf.jpeg')
    dest.write(data)
  }
}
