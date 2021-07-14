const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
// import { Processor } from 'windicss/lib'
// import { HTMLParser } from 'windicss/utils/parser'

// import fs from 'fs'
const fs = require('fs')
const path = require('path')

const glob = require('glob')
const outputCSS = []


getAllFiles().then(e => {
  console.log(e)
  console.log(allFiles)
  // const styles = generateStyles(html)
  // console.log(e)
  // fs.writeFileSync('compile_test.html', outputHTML.join(''));
  fs.writeFileSync(
    'public/windi.css',
    outputCSS
      .reduce(
        (previousValue, currentValue) => previousValue.extend(currentValue),
        // new NewStyleSheet()
      ) // Combine all stylesheet
      .sort()
      .combine()
  )
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


