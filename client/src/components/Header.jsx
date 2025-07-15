// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
  const isAuthenticated = false; 
  const userName = "User Name"; 

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
        
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="relative group">
            <button className="flex items-center space-x-2 text-lg font-medium hover:text-blue-200 transition duration-300 focus:outline-none">
              <span>Hi, {userName.split(' ')[0]}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 transform scale-95 group-hover:scale-100 origin-top-right">
              <Link to="/dashboard" className="block px-4 py-2 text-md hover:bg-gray-100">Dashboard</Link>
              <Link to="/profile" className="block px-4 py-2 text-md hover:bg-gray-100">Profile</Link>
              <button onClick={() => console.log('Logout')} className="block w-full text-left px-4 py-2 text-md hover:bg-gray-100">Logout</button>
            </div>
          </div>
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

export default Header;