

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode'; 

function CreateBlogPage() {
  const navigate = useNavigate();
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formMessage, setFormMessage] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        let fetchedCategories = [];

        if (Array.isArray(response.data)) {
          fetchedCategories = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          fetchedCategories = response.data.data;
        } else {
          console.warn("Category data from API is not an array or in an unknown format:", response.data);
          fetchedCategories = [];
        }

        setCategories(fetchedCategories);
        setLoadingCategories(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrorCategories(err.response ? err.response.data.message : err.message);
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!newBlog.title || !newBlog.content || !newBlog.categoryId) {
      setFormMessage('Please fill in all required fields (Title, Content, Category).');
      return;
    }

 
    const token = localStorage.getItem('token');
    let authorId = null;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
       
        console.log("Frontend - Decoded token:", decodedToken);

        authorId = decodedToken.id || decodedToken._id; 
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        setFormMessage('Invalid authentication token. Please log in again.');
        return;
      }
    }

    console.log("Frontend - Derived authorId before sending:", authorId);

    if (!authorId) { 
      setFormMessage('You must be logged in to create a blog. Author ID is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newBlog.title);
    formData.append('content', newBlog.content);
    formData.append('categoryId', newBlog.categoryId);
    formData.append('authorId', authorId); // Tokenden id ucun gondermek
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axiosInstance.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormMessage('Blog created successfully!');
      setNewBlog({
        title: '',
        content: '',
        categoryId: '',
      });
      setImageFile(null);
      navigate(`/blogs/${response.data.data._id}`); 
    } catch (err) {
      console.error('Error creating blog, full response:', err.response ? err.response.data : err.message);

      setFormMessage(`Error: ${err.response && err.response.data && typeof err.response.data.message === 'string' ? err.response.data.message : err.message}`);
    }
  };


  return (
    <div className="page-content bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto my-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Create New Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter blog title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
          <textarea
            id="content"
            name="content"
            value={newBlog.content}
            onChange={handleInputChange}
            required
            rows="8"
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Write your blog content here..."
          ></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Upload Image (Optional):</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor:pointer transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select
            id="categoryId"
            name="categoryId"
            value={newBlog.categoryId}
            onChange={handleInputChange}
            required
            className="shadow border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
            <option value="">Select a Category</option>
            {Array.isArray(categories) && categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 w-full text-lg"
        >
          Create Blog
        </button>
      </form>
      {formMessage && (
        <p className={`mt-6 text-center font-semibold text-lg ${formMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {formMessage}
        </p>
      )}
    </div>
  );
}

export default CreateBlogPage;