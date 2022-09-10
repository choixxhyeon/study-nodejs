// @ts-check
const { program } = require('commander')
const { Octokit } = require('octokit')

require('dotenv').config()

const { GITHUB_ACCESS_TOKEN } = process.env
const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })

program
  .command('me')
  .description('Check my profile')
  .action(async () => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated()
    console.log('Hello, %s!', login)
  })

program.parseAsync()
