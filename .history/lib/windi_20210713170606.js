const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
// import { Processor } from 'windicss/lib'
// import { HTMLParser } from 'windicss/utils/parser'

// import fs from 'fs'
const fs = require('fs')
const path = require('path')

const glob = require('glob')

glob('src/**/*.astro', function (err, files) {
  if (err) return console.log(err)
  console.log(files)
})

// async function * getFiles (dir) {
//   const dirents = await fs.readdir(dir, { withFileTypes: true })
//   for (const dirent of dirents) {
//     const res = path.resolve(dir, dirent.name)
//     if (dirent.isDirectory()) {
//       yield * getFiles(res)
//     } else {
//       yield res
//     }
//   }
// }

// const bob = async () => {
//   for await (const f of getFiles('.')) {
//     console.log(f)
//   }
// }

// bob()

async function getFiles (dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true }, e => {
    console.log(e)
    return e
  })
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : res
    })
  )
  return Array.prototype.concat(...files)
}

// getFiles('.', () => console.log('hi'))
// fs.readdir(
//   path.join(__dirname, '/../src/'),
//   { withFileTypes: true },
//   (err, files) => {
//     if (err) console.log(err)
//     else {
//       console.log('\nCurrent directory filenames:')
//       files.forEach(file => {
//         console.log(file)
//       })
//     }
//   }
// )

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
