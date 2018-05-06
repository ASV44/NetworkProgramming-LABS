import fs from 'fs'
import config from './config'

export default class DispatchHandler {

  constructor(client) {
    this.client = client

    let commandsPath =  __dirname + '/../quotes.json'
    this.quotes = JSON.parse(fs.readFileSync(commandsPath, 'UTF-8'))
  }

  help() {
    console.log('\nServer available commands:\n')
    for(var command in config.commands) {
      console.log(command + ' ' + config.commands[command].parameters
                          + ' ' + config.commands[command].description)
    }
  }

  hello(words) {
    words.forEach((item, position) => {
      this.client.write(item)
    })
  }

  quote() {
    let films = Object.keys(this.quotes)
    let random = Math.floor(Math.random() * films.length)
    let quotes = this.quotes[films[random]]
    random = Math.floor(Math.random() * quotes.length)
    this.client.write(quotes[random])
  }

  error(command, parameters) {
    this.client.write('Invalid command! ' + command + ' not found!' )
  }
}
