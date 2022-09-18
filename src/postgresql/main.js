// @ts-check

const { program } = require('commander')
const { Client } = require('pg')
const prompts = require('prompts')

async function connect() {
  const client = new Client({
    user: 'myuser',
    password: 'mypass',
    database: 'fc21',
  })
  await client.connect()
  return client
}

program.command('list').action(async () => {
  const client = await connect()

  const query = `SELECT * FROM users`
  const result = await client.query(query)

  console.log(result.rows)

  await client.end()
})

program.command('add').action(async () => {
  const client = await connect()
  const data = await prompts({
    type: 'text',
    name: 'userName',
    message: 'Write a user name to insert.',
  })

  const query = `INSERT INTO users (name) VALUES ('${(await data).userName}')`
  await client.query(query)

  await client.end()
})

program.command('delete').action(async () => {
  const client = await connect()
  const data = await prompts({
    type: 'text',
    name: 'userName',
    message: 'Write a user name to insert.',
  })

  // SQL injection 가능 지점
  // const query = `DELETE FROM users WHERE name = ('${(await data).userName}')`
  const query = `DELETE FROM users WHERE name = $1::text`
  await client.query(query, [data.userName])
  await client.end()
})

program.parseAsync()
