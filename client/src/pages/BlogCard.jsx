// src/components/BlogCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  const defaultImage = "https://via.placeholder.com/600x400/F3F4F6/9CA3AF?text=No+Image";
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <Link to={`/blogs/${blog._id}`} className="block">
        <img
          src={blog.image || defaultImage}
          alt={blog.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
          <Link to={`/blogs/${blog._id}`} className="hover:text-blue-600 transition duration-300">
            {blog.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.content}
        </p>
        <div className="flex flex-wrap items-center text-gray-500 text-sm mt-auto">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mr-2 mb-2">
            {blog.categoryId?.name || 'Uncategorized'}
          </span>
          <span className="mr-2 mb-2">
            By <span className="font-medium text-gray-700">{blog.authorId?.fullName || 'Anonymous'}</span>
          </span>
          <span className="mb-2">
            On {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;