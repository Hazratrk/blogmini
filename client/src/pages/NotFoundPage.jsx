import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page-content text-center bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-5xl font-extrabold text-gray-900 mb-4">404 - Səhifə Tapılmadı</h2>
      <p className="text-xl text-gray-700 mb-8">Axtardığınız səhifə mövcud deyil.</p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
      >
        Ana Səhifəyə Geri Dön
      </Link>
    </div>
  );
}

export default NotFoundPage;