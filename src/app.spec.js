/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-undef */

const supertest = require('supertest')
const app = require('./app')

const request = supertest(app)

test('retrieve user json', async () => {
  const result = await request.get('/users/15').accept('application/json')
  expect(result.body).toMatchObject({
    nickname: expect.any(String),
  })
})

test('retrieve user page', async () => {
  const result = await request.get('/users/15').accept('text/html')
  expect(result.text).toMatch(/^<html>.*<\/html>/)
})

test('update nickname', async () => {
  const res = await request
    .post('/users/15/nickname')
    .send({ nickname: 'choija' })
  expect(res.status).toBe(200)

  // const result = await request.get('/users/15').accept('application/json')
  // expect(result.body).toMatchObject({
  //   nickname: 'choija',
  // })
})
