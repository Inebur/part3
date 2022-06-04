const { request } = require('express')
const { application } = require('express')
require('dotenv').config() // for env variables. Should be done before app and express
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())

/**
 * To make express show static content, the page index.html and the JavaScript, etc., 
 * it fetches, we need a built-in middleware from express called static
 */
 app.use(express.static('build'))


/**
 * database part

 const mongoose = require('mongoose')
 const url = `mongodb+srv://phonebook-app-full:evangelion@cluster0.mppidvy.mongodb.net/?retryWrites=true&w=majority`
*/
const Person = require('./models/persons')
 
 

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
  Person.find({})
    .then(result => {
      persons = result
      response.json(result)
    //mongoose.connection.close()
  })
  
})


app.get('/info', (request, response) => {
  var today = new Date()
  response.send("<p>Phonebook has info for " + persons.length + " people</p> <p>" + today + "</p>")
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => { next(error)
    })

  /* before database
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }*/
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      persons = persons.filter(person => person.id !== id) // update frontend
      response.status(204).end()
    })
    .catch(error => next(error))

})

morgan.token('data', (request) => JSON.stringify(request.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


// another middleware


app.post('/api/persons', (request, response, next) => {
  
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


  const person = new Person({
    "id" : parseInt(Math.random()*(10000)), 
    "name" : body.name, 
    "number" : body.number,

  })

  person.save()
    .then(savedPerson => {
    persons = persons.concat(savedPerson)
    response.json(persons)
    /*
    
    response.json(savedPerson)*/
    })
    .catch(error => {
      console.log("FFFFFFF" + error)
      next(error)
    
    })

  
  //
  /* before database
  //console.log(request.headers)
  */
  //response.json(persons)
  
  
})

/** 
 * This errorHandler has to be after the post request
*/
const errorHandler = (error, request, response, next) => {
  console.error("error messge" + error.message)

  if (error.name === 'CastError') {
    
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
   
    return response.status(400).json({ error: error.message})
  }

 
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.put('/api/persons/:id',  (request, response, next) => {

  const {name, number} = request.body

  /*
  const person = {
    name: body.name,
    number: body.number,
  }
  */
  Person.findByIdAndUpdate(
    request.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
} )



