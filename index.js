require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const fuzzy = require("fuzzy")
var cors = require('cors')

var fs = require('fs');
var cities = JSON.parse(fs.readFileSync('./public/city.list.json', 'utf8'));

const fuzzyFilterOptions = {
        extract: function(el) { return el.name}
};

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(cors())
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/city_autocomplete', (req, res) => {
        const searchString =req.query.searchString
        const filteredCities = fuzzy
            .filter(searchString, cities, fuzzyFilterOptions)
            .slice(0, 50)
            .map(function(item){ return item.original})
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({cities: filteredCities}));
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
