// blog-app-server/app.js

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json()); 
app.use(cors());


const blogRoutes = require('./src/routes/blogRoutes');
const categoryRoutes = require('./src/routes/categoryRoute');


app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);


app.get('/', (req, res) => {
  res.send('Blog App Server API-yə xoş gəldiniz!');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;