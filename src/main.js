// @ts-check

/**
 * 프레임워크 없이 간단한 웹 서버 만들기
 *
 * 블로그 포스팅 서비스
 * - 로컬 파일을 데이터 베이스로 활용(JSON)
 * - 인증로직 X
 * - Restful API
 * */

const http = require('http')
const { routes } = require('./api')

/**
 * Post
 *
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */
const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (r) => req.url && r.url.test(req.url) && r.method === req.method
    )

    if (!req.url || !route) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const regexResult = route.url.exec(req.url)
    if (!regexResult) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const body =
      (req.method === 'POST' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('Ill-formed JSON'))
            }
          })
        }))) ||
      undefined

    const result = await route.callback(regexResult, body)
    res.statusCode = result.statusCode

    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result.body))
    }
  }

  main()
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
