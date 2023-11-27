//mongo password: sTw4cfPAAAMzswmu
//mongo db connection: mongodb+srv://leamaljk:<password>@cluster0.askaziu.mongodb.net/?retryWrites=true&w=majority
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');

const Sauce = require('./models/sauce');


const app = express();


mongoose.connect('mongodb+srv://leamaljk:sTw4cfPAAAMzswmu@cluster0.askaziu.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

//Security prevent malicious requests
//To unlock certain CORS security systems
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
  
 
app.use(bodyParser.json());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;