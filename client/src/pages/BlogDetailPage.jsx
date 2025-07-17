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
        const response = await axiosInstance.get(`/blogs/${id}`);
        setBlog(response.data.data);
      } catch (err) {
        console.error('Error while loading blog:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An error occurred while fetching blog data.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setLoading(false);
      setError("Blog ID was not found in URL. Please return to the homepage.");
    }
  }, [id]);

  if (loading) {
    return (
      <div className="page-content flex justify-center items-center h-screen min-h-[500px] text-xl font-medium text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-20 border-t-blue-500 mr-3"></div>
        Loading blog details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content flex justify-center items-center h-screen min-h-[500px] bg-red-50 p-8 rounded-lg shadow-md text-red-700 border border-red-300 mx-auto max-w-2xl my-8 text-center">
        <p className="text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="page-content flex justify-center items-center h-screen min-h-[500px] text-xl font-medium text-gray-700">
        Blog not found.
      </div>
    );
  }

  const defaultImage = "https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png";
  const displayImage = blog.imageUrl || defaultImage;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden"> 
          <img
            src={displayImage} 
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-10"> 
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white text-center leading-tight drop-shadow-2xl">
              {blog.title}
            </h1>
          </div>
        </div>

        <div className="p-8 md:p-10 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-700 text-base">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-blue-600">👤</span>
            <span className="font-semibold">
              Author: {blog.authorId ? (blog.authorId.fullName || blog.authorId.email) : 'Unknown Author'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-purple-600">🏷️</span>
            <span className="font-semibold">
              Category: {blog.categoryId ? blog.categoryId.name : 'Uncategorized'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-green-600">📅</span>
            <span className="font-semibold">
              Published on: {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="p-8 md:p-10 bg-white">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 bg-gray-50 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
