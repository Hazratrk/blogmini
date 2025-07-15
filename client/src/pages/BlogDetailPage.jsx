import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blogs/${id}`);
        setBlog(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Blog çekilirken hata oluştu:', err);
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="page-content text-center text-lg font-medium">Blog yüklənir...</div>;
  }

  if (error) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-4 rounded-md border border-red-400">Hata: {error}. Zəhmət olmasa konsolu yoxlayın.</div>;
  }

  if (!blog) {
    return <div className="page-content text-center text-gray-600">Blog tapılmadı.</div>;
  }

  return (
    <div className="page-content bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">{blog.title}</h2>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6 shadow-md"
        />
      )}
      <p className="text-gray-800 leading-relaxed text-lg mb-6">{blog.content}</p>
      <div className="text-gray-600 text-base border-t border-gray-200 pt-4 mt-4">
        <p className="mb-1">
          <span className="font-semibold">Kateqoriya:</span> {blog.categoryId && blog.categoryId.name ? blog.categoryId.name : 'Bilinmir'}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Yazar:</span> {blog.authorId && blog.authorId.fullName ? blog.authorId.fullName : 'Bilinmir'}
        </p>
        <p>
          <span className="font-semibold">Yaradılma Tarixi:</span> {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-8 text-center">
        <Link to="/blogs" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Bütün Bloglara Geri Dön
        </Link>
      </div>
    </div>
  );
}

export default BlogDetailPage;