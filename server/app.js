

const express = require('express');
const dotenv = require('dotenv'); 
const connectDB = require('./src/config/db'); 
const cors = require('cors');
const cookieParser = require('cookie-parser'); 




const app = express();


connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));


const authRoutes = require('./src/routes/authRoutes'); 
const blogRoutes = require('./src/routes/blogRoutes'); 
const categoryRoutes = require('./src/routes/categoryRoutes'); 



app.use('/api/auth', authRoutes); 
app.use('/api/blogs', blogRoutes); 
app.use('/api/categories', categoryRoutes); 

app.get('/', (req, res) => {
  res.send('Blog API-yə xoş gəldiniz!');
});


const PORT = process.env.PORT || 5450; 

app.listen(PORT, () => {
  console.log(`Server ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`);
});
