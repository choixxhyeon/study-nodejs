const fs = require('fs')

const rs = fs.createReadStream('src/stream/files/big-file', {
  encoding: 'utf-8',
  highWaterMark: 65536 * 4,
})

const counts = {
  a: 0,
  b: 0,
}

let chunkCount = 0
let prevStr = ''

rs.on('data', (data) => {
  chunkCount += 1
  for (let i = 0; i < data.length; i += 1) {
    if (data[i] !== prevStr) {
      const newStr = data[i]

      if (!newStr) {
        // eslint-disable-next-line no-continue
        continue
      }

      prevStr = newStr
      counts[newStr] += 1
    }
  }
})

rs.on('end', () => {
  console.log('event end!')
  console.log('chunkCount: ', chunkCount)
  console.log('counts: ', counts)
})
