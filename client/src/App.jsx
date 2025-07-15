import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header'; 
                                        
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import { AuthProvider, useAuth } from './context/AuthContext'; 

import './index.css';


function DynamicHeader() {
  const { isAuthenticated, user, logout } = useAuth(); 

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400">
          Blog App
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className="text-lg hover:text-blue-400 transition-colors duration-300">Ana Səhifə</Link>
            </li>
            <li>
              <Link to="/blogs" className="text-lg hover:text-blue-400 transition-colors duration-300">Bloglar</Link>
            </li>
            {isAuthenticated && ( 
              <li>
                <Link to="/blogs/new" className="text-lg hover:text-blue-400 transition-colors duration-300">Yeni Blog</Link>
              </li>
            )}
            
            {isAuthenticated ? (
              <>
   
                <li className="text-lg text-gray-300">Salam, {user?.fullName || user?.email || 'İstifadəçi'}!</li> 
                <li>
                  <button 
                    onClick={logout} 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-300"
                  >
                    Çıxış
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-lg hover:text-blue-400 transition-colors duration-300">Daxil Ol</Link></li>
                <li><Link to="/register" className="text-lg hover:text-blue-400 transition-colors duration-300">Qeydiyyat</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
 
    return <div className="page-content text-center text-lg font-medium py-10">Yüklənir...</div>;
  }


  if (!isAuthenticated) {
    return <LoginPage />; 
  }

  return children;
};


function App() {
  return (
    <Router>
      <AuthProvider> 
        <DynamicHeader /> 
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            
    
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route 
              path="/blogs/new" 
              element={
                <PrivateRoute> 
                  <CreateBlogPage />
                </PrivateRoute>
              } 
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;