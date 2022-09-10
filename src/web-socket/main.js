// @ts-check
const Koa = require('koa')
const Pug = require('koa-pug')
const path = require('path')
const websockify = require('koa-websocket')
const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')

const app = websockify(new Koa())

// @ts-ignore
// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

app.use(mount('/public', serve('src/public')))

app.use(async (ctx) => {
  await ctx.render('main')
})

app.ws.use(
  route.all('/ws', (ctx) => {
    ctx.websocket.on('message', (message, isBinary) => {
      console.log(isBinary ? message : message.toString())
      ctx.websocket.send('Hello, Client!')
    })
  })
)

app.listen(3000)
