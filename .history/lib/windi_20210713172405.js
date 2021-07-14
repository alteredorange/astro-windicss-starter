const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
// import { Processor } from 'windicss/lib'
// import { HTMLParser } from 'windicss/utils/parser'

// import fs from 'fs'
const fs = require('fs')
const path = require('path')

const glob = require('glob')

let allFiles
let html
const getAllFiles = async () => {
  allFiles = await glob.sync('src/**/+(*.astro|*.svelte|*.jsx|*.html)')

  // await glob('src/**/+(*.astro|*.svelte|*.jsx|*.html)', function (
  //   err,
  //   files
  // ) {
  //   if (err) return console.log(err)
  //   console.log(files)
  //   allFiles = files
  // })

  for (const i in allFiles) {
    html += fs.readFileSync(allFiles[i]).toString()
    console.log(html.length)
    console.log(allFiles[i])
  }

  // console.log(allFiles)

  return true
}

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

getAllFiles().then(e => {
  console.log(e)
  console.log(allFiles)
  const styles = generateStyles(html)
  // console.log(e)
  // fs.writeFileSync('compile_test.html', outputHTML.join(''));
  fs.writeFileSync('public/windi.css', styles)
})
// console.log(html)
// })
// add any file formats here that windi should search for

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
