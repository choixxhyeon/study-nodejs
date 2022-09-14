const fs = require('fs')

const ws = fs.createWriteStream('src/stream/files/big-file')

for (let i = 0; i < 500; i += 1) {
  const size = Math.floor(800 + Math.random() * 200)
  ws.write(`${i % 2 === 0 ? 'a' : 'b'}`.repeat(size))
}
