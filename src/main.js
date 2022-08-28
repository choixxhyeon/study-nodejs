// @ts-check

const express = require('express')
const userRouter = require('./router/user')

const app = express()
app.use(express.json())
app.use('/users', userRouter)
app.use('/public', express.static('src/public'))
app.set('views', 'src/views')
app.set('view engine', 'pug')

const PORT = 5000

app.get('/', (req, res) => {
  res.render('index', {
    message: 'Hello, Pug!!',
  })
})

// @ts-ignore
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The express server is listening at port: ${PORT}`)
})
