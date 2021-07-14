const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
// import { Processor } from 'windicss/lib'
// import { HTMLParser } from 'windicss/utils/parser'

// import fs from 'fs'
const fs = require('fs')

fs.readdir('./../src/**', { withFileTypes: true }, (err, files) => {
  if (err) console.log(err)
  else {
    console.log('\nCurrent directory filenames:')
    files.forEach(file => {
      console.log(file)
    })
  }
})

// const html = fs.readFileSync('../test/assets/example.html').toString();

function generateStyles (html) {
  // Get windi processor
  const processor = new Processor()

  // Parse all classes and put into one line to simplify operations
  const htmlClasses = new HTMLParser(html)
    .parseClasses()
    .map(i => i.result)
    .join('')

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
