const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
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


let persons = {
  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
     }
  ]
}



app.get('/api/persons', (req, res) => {
  res.json(persons)
})


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
  if ( persons.persons.some(a=>a.name === d.name) )
  {
    res.status(400).json( {'error': 'name must be unique'} );
    return;
  }
  console.log("num", d.number, "name", d.name);
  //TODO: what happens if array is empty
  var larg = persons.persons.reduce( (a,b) => (a.id>b.id)?a:b );
  d.id = larg.id+1;
  persons.persons.push(d);
  res.sendStatus(200);
})

app.get('/api/persons/:id', (req, res) => {
  var d = persons.persons.filter( a => a.id.toString()===req.params.id );
  if ( d.length === 0 )
  {
    res.sendStatus(404);
  }
  else
  {
    res.json(d.pop());
  }
})

app.delete('/api/persons/:id', (req, res) => {
  var d = persons.persons.filter( a => a.id.toString()!==req.params.id );
  if ( d.length === persons.persons.length )
  {
    res.sendStatus(404);
  }
  else
  {
    persons.persons = d;
    res.sendStatus(200);
  }
})


app.get('/info', (req, res) => {
  res.send('puhelinluettelossa ' + persons.persons.length + ' tiedot.<br>' + (new Date()) );
})


const port = process.env.PORT ||3001
app.listen(port)
console.log(`Server running on port ${port}`)
