const express = require('express')
const multer = require('multer')

const upload = multer({ dest: 'uploads/' })

const userRouter = express.Router()

const USERS = {
  15: {
    nickname: 'foo',
    profileImage: undefined,
  },
}

userRouter.get('/', (req, res) => {
  res.send('User list')
})

userRouter.param('id', async (req, res, next, value) => {
  try {
    const user = USERS[value]

    if (!user) {
      const error = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    // @ts-ignore
    req.user = user
    next()
  } catch (e) {
    next(e)
  }
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
      userId: req.params.id,
      profileImage: `/uploads/${req.user.profileImage}`,
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

userRouter.post('/:id/profile', upload.single('profile'), (req, res, next) => {
  const { user } = req
  user.profileImage = req.file.filename
  res.send('User profile image uploaded.')
})

module.exports = userRouter
