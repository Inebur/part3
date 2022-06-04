

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
else {
    const password = process.argv[2]

    const url = `mongodb+srv://phonebook-app-full:${password}@cluster0.mppidvy.mongodb.net/?retryWrites=true&w=majority`



    const noteSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
    })

    const Person = mongoose.model('Person', noteSchema)

    if(process.argv.length == 3){
        mongoose
        .connect(url)
        .then((result) => {
          //console.log('connected')
          
          Person.find({})
              .then(result => {
              result.forEach(person => {
                console.log(person)
              })
              mongoose.connection.close()
            })
            
         
        })
        .catch((err) => console.log(err))      
    }
    else if (process.argv.length == 5) {
        mongoose
        .connect(url)
        .then((result) => {
          //console.log('connected')
      
          
          const person = new Person({
            id: parseInt(Math.random()*10000),
            name: process.argv[3],
            number: process.argv[4],
            
          })
          console.log("added " + person.name + " number " + person.number + " to phonebook")
           return person.save()
          
         
        })
        
        .then(() => {
          //console.log('person not added!')
          return mongoose.connection.close()
        })
        
        .catch((err) => console.log(err))
      
    }
    else
        console.log("Number of arguments is not correct")

}
