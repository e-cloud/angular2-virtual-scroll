const version = require('../package.json').version;
const fs = require('fs')

const targetFilePath = 'dist/package.json'

const target = fs.readFileSync(targetFilePath).toString()

fs.writeFileSync(targetFilePath, target.replace(/"version":\s?"(.+?)"/, `"version": "${version}"`))

console.log('src version bumped')
