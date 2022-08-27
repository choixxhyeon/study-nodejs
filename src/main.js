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

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: '1',
    title: 'First Post',
    content: 'Hello!',
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Bye~!',
  },
]

/**
 * Post
 *
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */
const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/
  const postIdRegexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined

  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
      totalCount: posts.length,
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(result))
  } else if (postIdRegexResult && req.method === 'GET') {
    const id = postIdRegexResult[1]
    const post = posts.find((p) => p.id === id)

    if (!post) {
      res.statusCode = 404
      res.end('Post Not Found')
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(post))
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8')
    req.on('data', (data) => {
      const body = JSON.parse(data)
      posts.push(body)
    })

    res.statusCode = 200
    res.end('Creating post')
  } else {
    res.statusCode = 400
    res.end('Not Found')
  }
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
