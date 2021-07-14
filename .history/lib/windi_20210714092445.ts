const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

let allFiles
let html

const getAllFiles = async () => {
  allFiles = await glob.sync('src/**/+(*.astro|*.svelte|*.jsx|*.html)')

  for (const i in allFiles) {
    html += fs.readFileSync(allFiles[i]).toString()
  }
  return html
}

function generateStyles (html) {
  // Get windi processor
  const processor = new Processor()
  // Parse all classes and put into one line to simplify operations
  const htmlClasses = new HTMLParser(html)
    .parseClasses()
    .map(i => i.result)
    .join(' ')

  // Generate preflight based on the html we input
  const preflightSheet = processor.preflight(html)

  // Process the html classes to an interpreted style sheet
  const interpretedSheet = processor.interpret(htmlClasses).styleSheet

  // Build styles
  const APPEND = false
  const MINIFY = false
  const styles = interpretedSheet.extend(preflightSheet, APPEND).build(MINIFY)

  return styles
}

getAllFiles().then(allHtml => {
  const styles = generateStyles(allHtml)

  fs.writeFile('public/windi.css', styles, err => {
    if (err) return console.log(err)
    console.log('Styles Updated!')
  })
})
