const express = require('express')
const server = express()

const projects = []
let requestsCount = 0

/**
 * Middleware to validate if projects exists and atach project index in req object
 */
const projectExistsValidator = (req, res, next) => {
  const { id } = req.params

  const project = projects.find((project, index) => {
    if (project.id === id) {
      req.projectIndex = index
      return true
    } else {
      return false
    }
  })

  if (!project) {
    return res.status(400).json({ error: 'Project do not exists' })
  }
  return next()
}

/**
 * Middleware to log the number of requests
 */
const logRequestsCounter = (req, res, next) => {
  requestsCount++
  console.log(`Number of requests: ${requestsCount}`)
  return next()
}

server.use(express.json())
server.use(logRequestsCounter)

server.get('/projects', (req, res) => {
  res.json(projects)
})

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    !Array.isArray(tasks)
  ) {
    return res.status(400).json({ error: 'Invalid data types' })
  }

  if (projects.find(project => project.id === id)) {
    return res.status(400).json({ error: 'Project already exists' })
  }

  projects.push({ id, title, tasks })

  return res.json({ message: 'Project was included successfully' })
server.put('/projects/:id', projectExistsValidator, (req, res) => {
  const { projectIndex } = req
  const { id } = req.params
  const { title } = req.body

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid data types' })
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    title
  }

  return res.json(projects[projectIndex])
})

server.delete('/projects/:id', projectExistsValidator, (req, res) => {
  const { projectIndex } = req

  projects.splice(projectIndex, 1)

  return res.json({ message: 'Project was successfully removed' })
})

server.listen(3000)
