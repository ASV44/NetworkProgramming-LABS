import fs from 'fs'
let commandsPath =  __dirname + '/../commands.json'
let parsed = JSON.parse(fs.readFileSync(commandsPath, 'UTF-8'))

export default {
  port: process.env.PORT || 8000,
  commands: parsed
}
