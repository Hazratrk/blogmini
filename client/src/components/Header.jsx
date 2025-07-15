import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400">
          Blog App
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-lg hover:text-blue-400 transition-colors duration-300">Ana Səhifə</Link>
            </li>
            <li>
              <Link to="/blogs" className="text-lg hover:text-blue-400 transition-colors duration-300">Bloglar</Link>
            </li>
            <li>
              <Link to="/blogs/new" className="text-lg hover:text-blue-400 transition-colors duration-300">Yeni Blog</Link>
            </li>
            <li>
              <Link to="/login" className="text-lg hover:text-blue-400 transition-colors duration-300">Daxil Ol</Link>
            </li>
            <li>
              <Link to="/register" className="text-lg hover:text-blue-400 transition-colors duration-300">Qeydiyyat</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;