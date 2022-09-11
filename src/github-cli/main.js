// @ts-check
const { program } = require('commander')
const { url } = require('inspector')
const { Octokit } = require('octokit')
const { marked } = require('marked')
const chalk = require('chalk')
require('dotenv').config()

const { GITHUB_ACCESS_TOKEN } = process.env
const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })

// profile
program
  .command('me')
  .description('Check my profile.')
  .action(async () => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated()

    console.log('Hello, %s!', login)
  })

// get issues(bug)
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

// add labels
program
  .command('check-screenshots')
  .description(`Add labels if issue haven't screenshot.`)
  .action(async () => {
    const result = await octokit.rest.issues.listForRepo({
      owner: 'choixxhyeon',
      repo: 'study-nodejs',
      labels: 'bug',
    })

    let hasImage = false
    result.data.forEach((issue) => {
      if (issue.body) {
        const tokens = marked.lexer(issue.body)
        marked.walkTokens(tokens, (token) => {
          if (token.type === 'image') {
            hasImage = true
          }
        })

        if (hasImage) {
          octokit.rest.issues.removeLabel({
            owner: 'choixxhyeon',
            repo: 'study-nodejs',
            issue_number: issue.number,
            name: 'NEED SCREENSHOT',
          })
          octokit.rest.issues.addLabels({
            owner: 'choixxhyeon',
            repo: 'study-nodejs',
            issue_number: issue.number,
            labels: ['ADDED SCREENSHOT'],
          })
        } else {
          octokit.rest.issues.addLabels({
            owner: 'choixxhyeon',
            repo: 'study-nodejs',
            issue_number: issue.number,
            labels: ['NEED SCREENSHOT'],
          })
        }
      }
    })
  })

// parse markdown
program
  .command('parse-md')
  .description('')
  .action(() => {
    const tokens = marked.lexer(`### title text`)

    marked.walkTokens(tokens, (token) => {
      if (token.type === 'heading') {
        console.log(chalk.magenta('md has heading!'))
      }
    })
  })

program.parseAsync()
