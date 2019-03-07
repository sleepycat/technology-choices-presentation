const express = require('express')

let server = express()

server.get('/widgets/:id', (request, response) => {
  const { id } = request.params
  response
  .type('json')
  .send(
   JSON.stringify({ widgets: `select * from widgets where id = ${id};` }),
    )
})

server.listen(3000)
