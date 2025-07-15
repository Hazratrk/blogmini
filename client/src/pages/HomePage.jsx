import React from 'react';

function HomePage() {
  return (
    <div className="page-content bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Ana Səhifəyə Xoş Gəlmisiniz!</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Bu, sizin Blog Tətbiqinizdir. Başlamaq üçün yuxarıdakı menyuları istifadə edin.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Son blogları və ya kateqoriyaları burada göstərə bilərsiniz.
      </p>
    </div>
  );
}

export default HomePage;