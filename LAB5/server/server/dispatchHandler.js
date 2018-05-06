import config from './config'

export default class DispatchHandler {

  constructor(client) {
    this.client = client
  }

  help() {
    console.log('\nServer available commands:\n')
    for(var command in config.commands) {
      console.log(command + ' ' + config.commands[command].parameters 
                          + ' ' + config.commands[command].description)
    }
    // config.commands.forEach((item, position) => {
    //   console.log(item)
    // })
  }

  hello(words) {
    words.forEach((item, position) => {
      this.client.write(item)
    })
  }

  error(command, parameters) {
    this.client.write('Invalid command! ' + command + ' not found!' )
  }
}
