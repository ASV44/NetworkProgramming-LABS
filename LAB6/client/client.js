import config from './config'
import dgram from 'dgram'
import uuidv4 from 'uuid/v4'
import readline from 'readline'

export default class Client {

  constructor() {
    this.input = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    this.statesHandlers = {}
    this.STATES = {
      CMD : '/',
      CHAT : '>>>'
    }
    this.state = this.STATES.CMD
    this.addStateHandlers()
    this.address = {
      host: '230.185.192.108',
      port: '42424'
    }
    this.users = {}

    this.start()
  }

  addStateHandlers() {
    this.statesHandlers[this.STATES.CMD] = () => { this.comandsHandler() }
    this.statesHandlers[this.STATES.CHAT] = () => { this.chatHandler() }
  }

  start() {
    this.client = dgram.createSocket({type:'udp4',reuseAddr: true})

    this.client.on('listening', () => {
        var address = this.client.address()
        console.log('UDP Client listening on ' + address.address + ":" + address.port)
        this.client.setBroadcast(true)
        this.client.setMulticastTTL(128)
        this.client.addMembership(this.address.host)

        this.input.question('New User Name: ', (answer) => {this.addUser(answer)})
    })

    this.client.on('error', (err) => {
      console.log(`Error:\n${err.stack}`);
      this.client.close();
    })

    this.client.on('message', (msg, rinfo) => {
      //console.log(`Client got: ${msg} from ${rinfo.address}:${rinfo.port}`)
      this.processResponse(msg, rinfo)
    })

    this.client.bind(this.address.port)
  }

  addUser(userName) {
    let uuid = uuidv4()
    this.users[userName] = uuid
    let time = new Date().getTime()
    let registerMessage = `{:type :online, :username "${userName}"}`
    let encoded = new Buffer(registerMessage).toString('base64')
    registerMessage = `${time}|${uuid}|:all|${encoded}`
    encoded = new Buffer(registerMessage).toString('base64')
    this.sendData(encoded)
  }

  sendData(data) {
    this.client.send(data, this.address.port, this.address.host, (error) => {
      if(error){
        console.log(error)
        this.client.close();
      } else {
        this.requestInput()
      }
    })
  }

  requestInput() {
    this.input.question(this.state, (answer) => {this.addUser(answer)})
  }

  processResponse(message, info) {
    if(info.port !== this.address.port) {
      let decoded = new Buffer(message, 'base64').toString('ascii')
      let tokens = decoded.split('|')
      let respose = new Buffer(tokens[tokens.length - 1], 'base64').toString('ascii')
      let resposeTokens = respose.split(',')
      let parsed = {}
      resposeTokens.forEach((item, position) => {
        let itemTokens = item.split(' ')
        parsed[itemTokens[0]] = itemTokens[1]
      })
      this.responseHandler(parsed, tokens)
    }
  }

  responseHandler(response, tokens) {
    switch (response[':type']) {
      case 'online':
        this.users[response[':username']] = tokens[1]
        break;
      default:

    }
  }
}
