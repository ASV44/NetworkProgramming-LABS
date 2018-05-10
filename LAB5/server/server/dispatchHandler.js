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
    this.client.write('\nServer available commands:\n')
    for(var command in config.commands) {
      this.client.write(command + ' ' + config.commands[command].parameters
                                + ' ' + config.commands[command].description + '\n')
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
    let randomStars = 0
    if(isNaN(data) && data.length === 2 && data[0] === 'random') {
      let range = data[1].split('-')
      let min = parseInt(range[0])
      let max = parseInt(range[1])
      randomStars = Math.floor(Math.random() * (max - min) + min)
    }
    else if(!isNaN(data)){
      randomStars = parseInt(data)
    }
    else {
      this.error('/star', data);
    }
    let stars = new Array(randomStars).fill('⭐️')
    let message = ''
    stars.forEach((item, position) => {
      message += item + ' '
    })
    this.client.write(message)
  }

  getFile() {
    let filePath =  __dirname + '/../public/faf.jpeg'
    let stream = fs.createReadStream(filePath)
    stream.on('data', (data) => {
      this.client.write('file')
      this.client.write(data)
    })
    stream.on('error', (err) => {
      console.error(err)
    });
  }

  error(command, parameters) {
    this.client.write('Invalid command! ' + command + ' not found!' )
    let suggestion = this.suggest(command)
    this.client.write('Did you mean ' + suggestion)
  }

  suggest(failCommand) {
    let suggestion = ''
    for(var command in config.commands) {
      if(failCommand.includes(command) || command.includes(failCommand)) {
        suggestion += command + ' '
      }
    }
    return suggestion
  }
}
