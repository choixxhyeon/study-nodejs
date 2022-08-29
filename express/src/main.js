const app = require('./app')

const PORT = 5000

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The express server is listening at port: ${PORT}`)
})
