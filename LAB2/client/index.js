
import config from './config'
import express from 'express'
import https from 'https'

let app = express()

app.listen(config.port, () => {
  console.log('Application is running on port ' + config.port)
})
