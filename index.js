const { request } = require('express')
const { application } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

let persons =  [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/info', (request, response) => {
  var today = new Date()
  response.send("<p>Phonebook has info for " + persons.length + " people</p> <p>" + today + "</p>")
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

morgan.token('data', (request) => JSON.stringify(request.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.post('/api/persons', (request, response) => {
  
  const body = request.body
  
  
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if(persons.find(person => person.name == body.name)){
    return response.status(400).json({ 
      error: body.name + " already exists" 
    })
  }


  const person = {
    "id" : parseInt(Math.random()*(10000)), 
    "name" : body.name, 
    "number" : body.number

  }
  persons = persons.concat(person)
  //console.log(request.headers)
  response.json(persons)
  
  
  
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
} )