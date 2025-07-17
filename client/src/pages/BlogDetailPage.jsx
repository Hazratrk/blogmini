//blogdetail

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; 

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching blog with ID: ${id}`); // Debuggig
        const response = await axiosInstance.get(`/blogs/${id}`); 
        
  
        setBlog(response.data.data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err); // Debugg
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (id) { 
      fetchBlog();
    } else {
      setLoading(false);
      setError("Blog ID not provided in URL.");
    }
  }, [id]); 

  if (loading) {
    return <div className="page-content text-center text-xl font-medium text-gray-700">Loading blog details...</div>;
  }

  if (error) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-6 rounded-lg border border-red-400">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="page-content text-center text-xl font-medium text-gray-700">Blog not found.</div>;
  }


  return (
    <div className="page-content bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">{blog.title}</h1>
      {blog.image && (
        <div className="flex justify-center mb-6">
        
          <img 
            src={`http://localhost:5450${blog.image}`} 
            alt={blog.title} 
            className="rounded-lg max-h-96 object-cover" 
          />
        </div>
      )}
      <div className="text-gray-600 text-sm mb-6 text-center">

        <p>By: <span className="font-semibold">{blog.authorId ? (blog.authorId.fullName || blog.authorId.email) : 'Unknown Author'}</span></p>

        <p>Category: <span className="font-semibold">{blog.categoryId ? blog.categoryId.name : 'Uncategorized'}</span></p>
        <p>Published on: <span className="font-semibold">{new Date(blog.createdAt).toLocaleDateString()}</span></p>
      </div>
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        <p>{blog.content}</p>
      </div>
    </div>
  );
}

export default BlogDetailPage;