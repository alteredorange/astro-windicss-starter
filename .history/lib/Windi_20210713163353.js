const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
// import {Processor}from "windicss/lib"
// import {HTMLParser} from "windicss/utils/parser"

export function generateStyles(html) {
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

