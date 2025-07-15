// src/pages/BlogDetailPage.jsx

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
        console.error('Error fetching blog:', err);
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="page-content text-center text-xl font-medium text-gray-700">Loading blog details...</div>;
  }

  if (error) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-6 rounded-lg border border-red-400">Error: {error}. Please check the console.</div>;
  }

  if (!blog) {
    return <div className="page-content text-center text-gray-700 text-xl">Blog not found.</div>;
  }

  const defaultImage = "https://via.placeholder.com/1200x600/F3F4F6/9CA3AF?text=No+Image";

  return (
    <div className="page-content bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center leading-tight">{blog.title}</h1>
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 md:h-96 object-cover rounded-lg mb-8 shadow-md"
        />
      ) : (
        <img
          src={defaultImage}
          alt="No Image Available"
          className="w-full h-72 md:h-96 object-cover rounded-lg mb-8 shadow-md"
        />
      )}

      <div className="text-gray-700 leading-relaxed text-lg mb-8 prose prose-lg max-w-none">
        {blog.content}
      </div>

      <div className="text-gray-600 text-md border-t border-gray-200 pt-6 mt-6 flex flex-wrap justify-between items-center">
        <p className="mb-2 md:mb-0">
          <span className="font-semibold text-gray-800">Category:</span> {blog.categoryId?.name || 'Uncategorized'}
        </p>
        <p className="mb-2 md:mb-0">
          <span className="font-semibold text-gray-800">Author:</span> {blog.authorId?.fullName || 'Anonymous'}
        </p>
        <p className="mb-2 md:mb-0">
          <span className="font-semibold text-gray-800">Published:</span> {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link to="/blogs" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-md hover:shadow-lg">
          Back to All Blogs
        </Link>
      </div>
    </div>
  );
}

export default BlogDetailPage;