// @ts-check

const express = require('express')
const fs = require('fs')

const app = express()

const PORT = 5000

app.use('/', async (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Middleware1')

  const fileContent = await fs.promises.readFile('.gitignore')

  // @ts-ignore
  req.requestedAt = new Date()
  // @ts-ignore
  req.fileContent = fileContent
  next()
})

app.use((req, res) => {
  // eslint-disable-next-line no-console
  console.log('Middleware2')

  // @ts-ignore
  res.send(`Hello, Express! ${req.requestedAt}, ${req.fileContent}`)
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The express server is listening at port: ${PORT}`)
})
