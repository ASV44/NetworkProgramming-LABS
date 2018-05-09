import request from 'request'
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
    let movies = Object.keys(this.quotes)
    let random = Math.floor(Math.random() * movies.length)
    let randomMovie = movies[random]
    let quotes = this.quotes[randomMovie]
    random = Math.floor(Math.random() * quotes.length)
    this.client.write(randomMovie + ': ' + quotes[random])
  }

  weather(city) {
    let url ='http://api.openweathermap.org/data/2.5/weather?q=' + city +
             '&APPID=' + config.configs.weatherAPI.key

    request.get(url, (error, response, body) => {
      let data = JSON.parse(body)
      let temp = Number(data.main.temp - 273).toFixed(2)
      let message = 'Weather in ' + data.name + ': ' + temp + '°C ' +
                     data.weather[0].main + ', ' + data.weather[0].description

      this.client.write(message)
    })
  }

  star(data) {
    this.client.write('⭐️')
  }

  error(command, parameters) {
    this.client.write('Invalid command! ' + command + ' not found!' )
  }
}
