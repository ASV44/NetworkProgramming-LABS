import xmlParser from 'xml2js'

export default class DataParser {

  parse(contentType, data) {
    let parser = contentType === 'Application/xml' ? this.parseXML :
                 contentType === 'Application/json' ? this.parseJson :
                 contentType === 'text/csv' ? this.parseCSV : undefined

    let parsedData = parser !== undefined ? parser(data) : []
    return parsedData
  }

  parseJson(data) {
    let parsedData = []
    data.forEach(item => {
      let jsonData = JSON.parse(item)
      parsedData.push({id : jsonData['device_id'],
                     type : jsonData['sensor_type'],
                     value: jsonData['value']})
       })

    return parsedData
  }

  parseXML(data) {
    let xmlData = []
    data.forEach(item => {
      xmlParser.parseString(item, (err, result) => {
        xmlData.push({id : result['device']['$']['id'],
                      type : result['device']['type'][0],
                      value : result['device']['value'][0]})
      })
    })

    return xmlData
  }

  parseCSV(data) {
    let csvData = []
    data.forEach(item => {
      let splitData = item.split("\n")
      splitData.shift()
      splitData.pop()
      splitData.forEach(item => {
        let sensorData = item.split(",")
        csvData.push({id : sensorData[0],
                      type : sensorData[1],
                      value : sensorData[2]})
      })
    })

    return csvData
  }

}
