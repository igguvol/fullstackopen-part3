const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI;

mongoose.connect(url, (err) => { if(err) { console.log('database error:',err); process.exit();} } );

class PersonClass
{
  get format()
  {
    return {'name':this.name,'number':this.number,'id':this._id};
  }  
}

PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});

PersonSchema.loadClass(PersonClass);
const Person = mongoose.model('Persons', PersonSchema);

module.exports = Person;
