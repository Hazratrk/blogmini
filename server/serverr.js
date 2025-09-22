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


app.set('trust proxy', 1);


const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173', 
  'http://127.0.0.1:5173'
];


if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
  allowedOrigins.push('*');
}

app.use(cors({
  origin: function (origin, callback) {
  
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS tərəfindən qadağan edildi'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


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


app.get('/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Server işləyir',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, 'dist')));
  app.use(express.static(path.join(__dirname, 'build')));
  app.use(express.static(path.join(__dirname, 'public')));
  
 
  app.get('*', (req, res) => {
    
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return res.status(404).json({ message: 'API endpoint tapılmadı' });
    }
    
 
    const indexPaths = [
      path.join(__dirname, 'dist', 'index.html'),
      path.join(__dirname, 'build', 'index.html'),
      path.join(__dirname, 'public', 'index.html')
    ];
    
    for (const indexPath of indexPaths) {
      try {
        return res.sendFile(indexPath);
      } catch (err) {
        continue;
      }
    }
    
   
    res.status(404).json({ message: 'Frontend faylları tapılmadı' });
  });
} else {

  app.get('/', (req, res) => {
    res.json({ 
      message: 'Development Server işləyir', 
      status: 'success',
      port: process.env.PORT || 8000,
      mongodb: mongoose.connection.readyState === 1 ? 'Bağlıdır' : 'Bağlı deyil'
    });
  });
}


app.use((err, req, res, next) => {
  console.error('Server xətası:', err.stack);
  res.status(500).json({ 
    message: 'Server xətası', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error' 
  });
});


app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint tapılmadı',
    requested: req.originalUrl 
  });
});


const startServer = async () => {
  try {

    await connectDB();
    
  
    const PORT = process.env.PORT || 8000;
    
 
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda işə düşdü`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Client URL: ${process.env.CLIENT_URL || 'Təyin edilməyib'}`);
      console.log(`💾 MongoDB: ${process.env.MONGO_URI ? 'Konfiqurasiya edilib' : 'Konfiqurasiya yoxdur'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      
   
      if (process.env.NODE_ENV === 'production') {
        console.log(`🔧 Production mode aktiv`);
        console.log(`📁 Static files axtarılır: dist/, build/, public/`);
      }
    });
  } catch (error) {
    console.error('❌ Server başlatma xətası:', error);
    process.exit(1);
  }
};


process.on('SIGTERM', async () => {
  console.log('SIGTERM alındı, server bağlanır...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT alındı, server bağlanır...');
  await mongoose.connection.close();
  process.exit(0);
});


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});


startServer();
