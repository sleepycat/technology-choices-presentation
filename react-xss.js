const React = require('react')
const { renderToString } = require('react-dom/server')
const express = require('express')
const app = express()

app.get('/', (request, response) => {
  const { name } = request.query

  return response.type('html').send(
    renderToString(
      <html>
        <body>Hello {name}</body>
      </html>,
    ),
  )
})

app.listen(3000)
