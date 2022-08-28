// @ts-check

const express = require('express')
// const bodyParser = require('body-parser')

const app = express()
const userRouter = express.Router()

app.use(express.json())
app.use('/users', userRouter)

app.set('views', 'src/views')
app.set('view engine', 'pug')

const Users = {
  15: {
    nickname: 'foo',
  },
}

const PORT = 5000
userRouter.get('/', (req, res) => {
  res.send('User list')
})

userRouter.param('id', (req, res, next, value) => {
  // @ts-ignore
  req.user = Users[value]
  next()
})

userRouter.get('/:id', (req, res) => {
  const resMimeType = req.accepts(['json', 'html'])

  if (resMimeType === 'json') {
    // @ts-ignore
    res.send(req.user)
  } else {
    res.render('user-profile', {
      // @ts-ignore
      nickname: req.user.nickname,
    })
  }
})

userRouter.post('/', (req, res) => {
  res.send('User Registered.')
})

userRouter.post('/:id/nickname', (req, res) => {
  // @ts-ignore
  const { user } = req
  const { nickname } = req.body
  user.nickanme = nickname

  res.send('User nickname Updated')
})

app.get('/', (req, res) => {
  res.render('index', {
    message: 'Hello, Pug!!',
  })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The express server is listening at port: ${PORT}`)
})
