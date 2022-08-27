// @ts-check

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches: string[], body: Object | undefined) => Promise<APIResponse>} callback
 */

const fs = require('fs')

/** @returns {Promise<Post[]>} */
async function getPosts() {
  const json = await fs.promises.readFile('db.json', 'utf-8')
  return JSON.parse(json).posts
}

/** @param {Post[]} posts */
async function savePosts(posts) {
  const content = { posts }
  return fs.promises.writeFile('db.json', JSON.stringify(content), 'utf-8')
}

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      body: await getPosts(),
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1]
      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not Found',
        }
      }

      const posts = await getPosts()
      const post = posts.find((p) => p.id === postId)
      if (!post) {
        return {
          statusCode: 404,
          body: 'Not Found',
        }
      }

      return {
        statusCode: 200,
        body: post,
      }
    },
  },
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'Ill-foremd request',
        }
      }

      /** @type Post */
      // @ts-ignore
      const post = body

      const posts = await getPosts()
      posts.push(post)
      await savePosts(posts)

      return {
        statusCode: 200,
        body: 'Created.',
      }
    },
  },
]

module.exports = {
  routes,
}
