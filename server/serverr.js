import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';


dotenv.config();

const app = express();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
 
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB-yə uğurla qoşuldu!');
  } catch (error) {
    console.error('❌ MongoDB-yə qoşulma zamanı xəta:', error.message);
    process.exit(1);
  }
};


app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);


app.use('/uploads', express.static('uploads'));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}


if (process.env.NODE_ENV === 'development') {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Server işləyir', 
      status: 'success',
      port: process.env.PORT || 8000
    });
  });
}


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server xətası', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error' 
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route tapılmadı',
    requested: req.originalUrl 
  });
});


const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 8000;
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server ${PORT} portunda işə düşdü.`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log(`💾 MongoDB: ${process.env.MONGO_URI ? 'Bağlıdır' : 'Konfiqurasiya yoxdur'}`);
    });
  } catch (error) {
    console.error('❌ Server başlatma xətası:', error);
    process.exit(1);
  }
};


process.on('SIGTERM', () => {
  console.log('SIGTERM alındı, server bağlanır...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT alındı, server bağlanır...');
  mongoose.connection.close();
  process.exit(0);
});

startServer();
