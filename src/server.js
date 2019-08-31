const express = require('express')

const server = express()

server.use(express.json())

const projects = []

server.get('/projects', (req, res) => {
  res.json(projects)
})
})

server.listen(3000)
