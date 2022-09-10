// @ts-check
const fs = require('fs')
const http = require('http')
const path = require('path')
const { createApi } = require('unsplash-js')
const { default: fetch } = require('node-fetch')
const { pipeline } = require('stream')
const { promisify } = require('util')
const sharp = require('sharp')

require('dotenv').config()

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  // @ts-ignore
  fetch,
})

/**
 * @param {string} query
 * @returns
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({ query })

  if (!result.response) {
    throw new Error('Failed to search Image.')
  }

  const image = result.response.results[0]

  if (!image) {
    throw new Error('No image found.')
  }

  return {
    description: image.description || image.alt_description,
    url: image.urls.regular,
  }
}

/**
 *
 * @param {string} query
 */
async function getImage(query) {
  const filePath = path.resolve(__dirname, `images/${query}`)

  if (fs.existsSync(filePath)) {
    return {
      message: 'Cached Image.',
      stream: fs.createReadStream(filePath),
    }
  }

  const result = await searchImage(query)
  const resp = await fetch(result.url)

  await promisify(pipeline)(resp.body, fs.createWriteStream(filePath))

  return {
    message: 'New Image.',
    stream: fs.createReadStream(filePath),
  }
}

/**
 *
 * @param {string} url
 */
function convertURLToQuery(url) {
  const urlObj = new URL(url, 'http://localhost:5000')
  const widthStr = urlObj.searchParams.get('width')
  const width = widthStr ? parseInt(widthStr, 10) : 400

  return {
    query: urlObj.pathname.slice(1),
    width,
  }
}

const server = http.createServer((req, res) => {
  async function main() {
    if (!req.url) {
      req.statusCode = 400
      res.end('Needs URL ')
      return
    }

    const { query, width } = convertURLToQuery(req.url)
    try {
      const { message, stream } = await getImage(query)
      console.log('>>> ', message)

      await promisify(pipeline)(stream, sharp().resize(width).png(), res)
    } catch (e) {
      console.log(e)
      res.statusCode = 400
      res.end()
    }

    // resp.body.pipe(fs.createWriteStream('image/download'))
    // resp.body.pipe(res) // stream
  }

  main()
})

const PORT = 5000
server.listen(PORT, () => {
  console.log('The server is listening at port: ', PORT)
})
