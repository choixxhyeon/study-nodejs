// @ts-check
const { program } = require('commander')
const { url } = require('inspector')
const { Octokit } = require('octokit')

require('dotenv').config()

const { GITHUB_ACCESS_TOKEN } = process.env
const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })

program
  .command('me')
  .description('Check my profile.')
  .action(async () => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated()

    console.log('Hello, %s!', login)
  })

program
  .command('bugs')
  .description('Issues with bug label.')
  .action(async () => {
    const result = await octokit.rest.issues.listForRepo({
      owner: 'choixxhyeon',
      repo: 'study-nodejs',
      labels: 'bug',
    })

    console.log(
      'Bugs : ',
      result.data.map((issue) => ({
        url: issue.url,
        title: issue.title,
        content: issue.body,
        createdBy: issue.user?.login,
      }))
    )
  })

program.parseAsync()
