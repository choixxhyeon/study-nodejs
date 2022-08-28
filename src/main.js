// @ts-check

const express = require('express')
// const bodyParser = require('body-parser')

const app = express()
const userRouter = express.Router()

app.use(express.json())
app.use('/users', userRouter)

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
  // @ts-ignore
  res.send(req.user)
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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The express server is listening at port: ${PORT}`)
})
