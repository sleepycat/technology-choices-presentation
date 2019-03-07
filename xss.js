const express = require('express')

const app = express()

app.get('/', (request, response) => {
  const { name } = request.query

  response.type('html').send(`
    <html>
      <body>Hello ${name}</body>
    </html>
  `)
})

app.listen(3000)
