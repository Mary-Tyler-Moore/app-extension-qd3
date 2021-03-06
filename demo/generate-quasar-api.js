#!/usr/bin/env node

const fs = require('fs-extra'),
  readline = require('readline'),
  path = require('path'),
  quasarPath = 'node_modules/quasar',
  componentsPath = path.join(quasarPath, 'src/components'),
  apiPath = path.join(quasarPath, 'dist/api'),
  quasarApi = {}

const apis = fs.readdirSync(apiPath)
  .map(fileName => fileName.replace('.json', ''))
apis
  .forEach(apiName => {
    quasarApi[apiName] = {
      related: []
    }

    fs.readFile(path.join(apiPath, apiName + '.json'), 'UTF-8', (err, data) => {
      if (err) {
        throw err
      }

      const api = JSON.parse(data)
      quasarApi[apiName].api = api
    })
  })

fs.readdirSync(componentsPath).forEach(componentDir => {
  const group = 'Q' + componentDir.split('-').map(c => c[0].toUpperCase() + c.slice(1)).join('')
  fs.readdir(path.join(componentsPath, componentDir), (err, files) => {
    if (err) {
      throw err
    }

    files.forEach(file => {
      let component = ''
      if (file.endsWith('.js') && apis.includes(component = file.replace('.js', ''))) {
        const componentData = quasarApi[component]
        componentData.group = group

        const componentStream = fs.createReadStream(path.join(componentsPath, componentDir, file))
        const rl = readline.createInterface({
          input: componentStream,
          output: () => {}
        })

        rl.on('line', line => {
          let matches = null
          if ((matches = /import (\S+) from/g.exec(line)) != null && apis.includes(matches[1])) {
            componentData.related.push(matches[1])
          }
        })
      }
    })
  })
})

process.on('exit', () => {
  fs.writeFileSync('quasar-api.json', JSON.stringify(quasarApi, '', 2))
})