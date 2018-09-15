const Person = require('./models/Person')
const mongoose = require('mongoose')

if ( process.argv.length == 2 )
{
  Person.find({})
    .then(person=>{
      const mapped = person.map( a => ({'name':a.name,'number':a.number,'id':a._id }) )
      console.log(mapped)
      mongoose.connection.close()
    })
    .catch( error => console.log(error) )
}
else if ( process.argv.length == 4)
{
  const tyyppi = new Person( {'name':process.argv[2],'number':process.argv[3]} )
  tyyppi
    .save()
    .then(response => {
      console.log('note saved: ', response)
      mongoose.connection.close()
    })
    .catch( error => console.log(error) )
}
else
{
  console.log('usage: node mongo.js name number')
  process.exit()

}
