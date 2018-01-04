// server.js
// load the things we need
const express = require('express');
const app = express();
const POKEMONS = require('./pokemons.json')

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', (req, res) => {
  let pokemon = req.query.pokemon || getRandomItem(POKEMONS);
  res.render('pages/index', {
    domain: process.env.DOMAIN_DEFAULT || './',
    pokemon,
  });
});

app.set('PORT', process.env.PORT || 8080);
app.listen(app.get('PORT'));
console.log(`${app.get('PORT')} is the magic port`);
