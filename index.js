const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person');
const mongoose = require('mongoose')



app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());
app.use( morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    JSON.stringify(req.body),
    tokens.status(req, res), 
    tokens.res(req,res,'Content-Length'),
    '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
);


app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(person=>{
      res.json( person.map( a => {console.log(a.format);return a.format} ) );
    })
    .catch( error => console.log(error) );
});


app.post('/api/persons', (req, res) => {
  var d = req.body;
  if ( d.number === undefined || d.number === '' )
  {
    res.status(400).json( {'error': 'missing number'} );
    return;
  }
  if (d.name === 'undefined' || d.name === '' )
  {
    res.status(400).json( {'error': 'missing name'} );
    return;
  }
  Person
    .find( {name:d.name} )
    .then( a => {
      if ( a.length === 0 )
      {
        const tyyppi = new Person( {"name":d.name,"number":d.number} );
        tyyppi
          .save()
          .then(v => {
            res.status(201).json(v.format);
          })
          .catch( error => console.log(error) );
      }
      else
      {
        res.sendStatus(409);
      }
    } )
    .catch( e => console.log('________ error: ', e) );

})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById( req.params.id )
    .then(person => {
      res.json( person.format );
    })
    .catch( error => res.status(400).send({ error: 'malformatted id' }) );
});

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    });
})

app.put('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndUpdate(req.params.id,req.body)
    .then(result => {
      res.json(result.format);
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    });
})


app.get('/info', (req, res) => {
  Person.find({})
    .then(person=>{
      res.send('puhelinluettelossa ' + person.length + ' henkilön tiedot.<br>' + (new Date()) );
    })
    .catch( error => console.log(error) );
})


const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)
