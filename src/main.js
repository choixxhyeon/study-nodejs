// @ts-check

const express = require('express')

const app = express()

const PORT = 5000

app.use('/', (req, res) => {
  res.send('Hello, Express!')
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The express server is listening at port: ${PORT}`)
})
