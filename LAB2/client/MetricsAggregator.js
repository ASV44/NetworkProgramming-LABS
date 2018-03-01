import request from 'request'
import progress from 'cli-progress'
import xmlParser from 'xml2js'

export default class MetricsAggregator {

  constructor() {
    this.progressBar = new progress.Bar({}, progress.Presets.shades_classic);
    this.devicesData = []
    this.aggregatedData = {}
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
        this.handleDeviceResponse(body, paths)
      });
    })
  }

  handleDeviceResponse(response, paths) {
    this.devicesData.push(response)
    this.progressBar.update(this.devicesData.length / paths.length * 100)
    if(this.devicesData.length == paths.length) {
      this.progressBar.stop()
      console.log(this.devicesData.pop())
      this.parseDevicesData()
    }
  }

  parseDevicesData() {
    this.devicesData.forEach(item => {
      //console.log(item, this.getResponseType(item))
      switch (this.getResponseType(item)) {
        case 'XML':
          xmlParser.parseString(item, (err, result) => {
            let id = result['device']['$']['id']
            let type = result['device']['type'][0]
            let value = result['device']['value'][0]
            this.addAggregatedData(id, type, value)
          })
          break;
        case 'CSV':
          this.parseCSV(item)
          break
        default:

      }
    })
    console.log(this.aggregatedData)
  }

  getResponseType(data) {
    let type = data.startsWith("<") ? 'XML'  :
               data.startsWith("{") ? 'Json' : 'CSV'

    return type
  }

  parseCSV(data) {
    let splitData = data.split("\n")
    splitData.shift()
    splitData.pop()
    splitData.forEach(item => {
      let sensorData = item.split(",")
      this.addAggregatedData(sensorData[0], sensorData[1], sensorData[2])
    })
  }

  addAggregatedData(id, type, value) {
    if(this.aggregatedData[type] === undefined) {
      this.aggregatedData[type] = []
    }
    this.aggregatedData[type].push({
      id : id,
      value : value
    })
  }
}
