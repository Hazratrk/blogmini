import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateBlogPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [fetchCategoriesError, setFetchCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
          if (response.data.data.length > 0) {
            setCategoryId(response.data.data[0]._id);
          }
        } else {
          console.error('Unexpected category API response format or empty data:', response.data);
          setFetchCategoriesError('Failed to load categories: Unexpected data format or no categories found.');
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err.response ? err.response.data : err.message);
        setFetchCategoriesError('Failed to load categories. Please ensure the backend is running.');
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!image) {
      setUploadMessage('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadMessage('Uploading image...');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(response.data.imageUrl);
      setUploadMessage('Image uploaded successfully!');
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response ? err.response.data.message : 'Image upload failed.');
      setUploadMessage(`Error: ${err.response ? err.response.data.message : 'Image upload failed.'}`);
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !content || !categoryId || !user) {
      setError('Please fill in all required fields: Title, Content, Category, and ensure you are logged in.');
      setLoading(false);
      return;
    }

    if (categoryId === "") {
      setError('Please select a category.');
      setLoading(false);
      return;
    }

    try {
      const blogData = {
        title,
        content,
        imageUrl: imageUrl,
        categoryId: categoryId,
        authorId: user.id,
      };

      await axiosInstance.post('/blogs', blogData);
      navigate('/');
    } catch (err) {
      console.error('Create blog error:', err);
      setError(err.response ? err.response.data.message : 'Failed to create blog.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="page-content text-center text-red-500">You must be logged in to create a blog.</div>;
  }

  return (
    <div className="page-content bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Create New Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-800 text-lg font-semibold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-base border-gray-300 rounded-md p-3"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-gray-800 text-lg font-semibold mb-2">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-base border-gray-300 rounded-md p-3"
            placeholder="Write your blog content here..."
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-gray-800 text-lg font-semibold mb-2">Category:</label>
          {fetchCategoriesError && <p className="text-red-500 text-sm mb-2">{fetchCategoriesError}</p>}
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-base border-gray-300 rounded-md p-3 bg-white"
            required
          >
            {categories.length === 0 && !fetchCategoriesError ? (
              <option value="">Loading categories...</option>
            ) : (
              <>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Upload Image</h3>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={loading || !image}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
          {uploadMessage && (
            <p className={`mt-2 text-sm ${uploadMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {uploadMessage}
            </p>
          )}
          {imageUrl && (
            <div className="mt-4">
              <p className="text-green-600 text-sm">Image Preview:</p>
              <img src={imageUrl} alt="Uploaded preview" className="mt-2 max-w-full h-48 object-cover rounded-md shadow-md" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg"
          disabled={loading}
        >
          {loading ? 'Creating Blog...' : 'Create Blog'}
        </button>
        {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
}

export default CreateBlogPage;
