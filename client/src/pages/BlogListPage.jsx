import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
        if (Array.isArray(response.data.data)) {
          setBlogs(response.data.data);
        } else {
          console.warn("API'den gelen blog verisi beklendiği gibi bir dizi değil:", response.data);
          setBlogs([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Bloglar çekilirken hata oluştu:', err);
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="page-content text-center text-lg font-medium">Bloglar yüklənir...</div>;
  }

  if (error) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-4 rounded-md border border-red-400">Hata: {error}. Zəhmət olmasa konsolu yoxlayın.</div>;
  }

  return (
    <div className="page-content bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bütün Bloglar</h2>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600">Hələ heç blog tapılmayıb.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
          {Array.isArray(blogs) && blogs.map((blog) => (
            <div key={blog._id} className="blog-item bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300">
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                <Link to={`/blogs/${blog._id}`} className="hover:underline">
                  {blog.title}
                </Link>
              </h3>
              <p className="text-gray-700 mb-3 flex-grow">
                {blog.content.substring(0, 150)}...
              </p>
              <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-gray-200">
                <p>
                  **Kateqoriya:** {blog.categoryId && blog.categoryId.name ? blog.categoryId.name : 'Bilinmir'}
                </p>
                <p>
                  **Yazar:** {blog.authorId && blog.authorId.fullName ? blog.authorId.fullName : 'Bilinmir'}
                </p>
                <p>Yaradılma Tarixi: {new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogListPage;