// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'; // Make sure this path is correct

import { AuthProvider, useAuth } from './context/AuthContext';

import './index.css';

function DynamicHeader() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg py-4 px-6 md:px-12 flex justify-between items-center fixed w-full z-50">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-3xl font-extrabold tracking-tight hover:text-blue-200 transition duration-300">
          MyBlog
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/blogs" className="text-lg font-medium hover:text-blue-200 transition duration-300">
            Blogs
          </Link>
          {isAuthenticated && (
            <Link to="/blogs/new" className="text-lg font-medium hover:text-blue-200 transition duration-300">
              Create New Blog
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300 hidden md:block"
            >
              Hi, {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-lg font-medium hover:text-blue-200 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DynamicHeader />
        <main className="pt-20 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

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
      </AuthProvider>
    </Router>
  );
}

export default App;