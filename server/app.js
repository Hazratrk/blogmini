const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Blog API-yə xoş gəldiniz!');
});

const blogRoutes = require('./src/routes/blogRoutes'); 
const categoryRoutes = require('./src/routes/categoryRoutes');

app.use('/api/blogs', blogRoutes); 
app.use('/api/categories', categoryRoutes); 

module.exports = app;