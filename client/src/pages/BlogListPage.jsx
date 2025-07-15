// src/pages/BlogListPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import BlogCard from '../pages/BlogCard';

function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
        let fetchedBlogs = [];
        if (Array.isArray(response.data)) {
            fetchedBlogs = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            fetchedBlogs = response.data.data;
        } else {
            console.warn("Blog data from API is not an array or in an unknown format:", response.data);
            fetchedBlogs = [];
        }
        setBlogs(fetchedBlogs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="page-content text-center text-xl font-medium text-gray-700">Loading blogs...</div>;
  }

  if (error) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-6 rounded-lg border border-red-400">Error: {error}. Please check the console.</div>;
  }

  return (
    <div className="page-content py-8 px-4 md:px-8 lg:px-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">All Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No blogs found. Be the first to create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogListPage;