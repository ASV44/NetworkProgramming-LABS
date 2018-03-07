import request from 'request'
import progress from 'cli-progress'
import xmlParser from 'xml2js'
import DataParser from './DataParser'

export default class MetricsAggregator {

  constructor() {
    this.progressBar = new progress.Bar({}, progress.Presets.shades_classic);
    this.devicesData = {}
    this.aggregatedData = {}

    this.parser = new DataParser()

    this.received = 0
  }

  getKeyAndDevicesPaths() {
    request.post({
      headers: {'content-type' : 'application/json'},
      url:     'https://desolate-ravine-43301.herokuapp.com/'
    }, (error, response, body) => {
      let key = response.headers['session']
      let devicePaths = JSON.parse(body)
      console.log(key)
      console.log(devicePaths)

      this.progressBar.start(100, 0);
      this.getDevicesData(key, devicePaths)
    });
  }

  getDevicesData(key, paths) {
    paths.forEach(item => {
      request.get({
        headers: {'session' : key},
        url: 'https://desolate-ravine-43301.herokuapp.com' + item['path']
      },
      (error, response, body) => {
        this.received++
        this.handleDeviceResponse(response.headers['content-type'], body, paths)
      });
    })
  }

  handleDeviceResponse(type, response, paths) {
    if(this.devicesData[type] === undefined) {
      this.devicesData[type] = []
    }
    this.devicesData[type].push(response)
    this.progressBar.update(Number(this.received / paths.length).toFixed(4) * 100)
    if(this.received == paths.length) {
      this.progressBar.stop()
      console.log(this.devicesData['text/plain; charset=utf-8'][0])
      delete this.devicesData['text/plain; charset=utf-8']
      this.parseDevicesData()
    }
  }

  parseDevicesData() {
    for (var key in this.devicesData) {
      if (this.devicesData.hasOwnProperty(key)) {
        let parsedData = this.parser.parse(key ,this.devicesData[key])
        this.addAggregatedData(parsedData)
      }
    }
    this.showAggregatedData()
  }

  addAggregatedData(data) {
    data.forEach(item => {
      let type = item['type']
      delete item['type']
      if(this.aggregatedData[type] === undefined) {
        this.aggregatedData[type] = []
      }
      this.aggregatedData[type].push(item)
    })
  }

  showAggregatedData() {
    for(let i = 0; i < 6; i++) {
      let header = i == 0 ? 'Temperature' :
                   i == 1 ? 'Humidity'    :
                   i == 2 ? 'Motion'      :
                   i == 3 ? 'Alien Presence' :
                   i == 4 ? 'Dark Matter' : 'No name Sensor'
       console.log(header)
      if(this.aggregatedData['' + i] !== undefined) {
        this.aggregatedData['' + i].forEach(item => {
          console.log('Device ' + item['id'] + ": " + item['value'])
        })
      }
      console.log("\n")
    }
  }
}
