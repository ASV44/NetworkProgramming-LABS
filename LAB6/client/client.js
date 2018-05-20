import config from './config'
import dgram from 'dgram'
import uuid from 'uuid/v4'

export default class Client {

  constructor() {
    this.address = {
      host: '230.185.192.108',
      port: '42424'
    }
    this.start()
  }

  start() {
    this.client = dgram.createSocket('udp4')

    this.client.on('error', (err) => {
      console.log(`Server error:\n${err.stack}`);
      //this.client.close();
    })

    this.client.on('message', (msg, rinfo) => {
      console.log(`Client got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    })

    let message = 'MTUyNjgzNzUzNjk2MHwyMDk4MDMyZS1iZjcyLTRlZjUtOGQyNy03YmE4YTI3ZDM1ZDl8OmFsbHxlenAwZVhCbElEcHZibXhwYm1Vc0lEcDFjMlZ5Ym1GdFpTQWlXbHBhSW4wPQ=='
    this.client.send(message, this.address.port, this.address.host, (error) => {
      if(error){
        client.close();
      }else{
        console.log('Data sent !!!');
      }
    })
  }

}
