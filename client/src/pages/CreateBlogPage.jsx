import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function CreateBlogPage() {
  const navigate = useNavigate();
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    image: '',
    categoryId: '',

  });
  const [categories, setCategories] = useState([]);
  const [formMessage, setFormMessage] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        
        console.log('API-dən gələn kategoriyalar (tam cavab):', response);
        console.log('API-dən gələn kategoriyalar (response.data):', response.data);

        let fetchedCategories = [];

        if (Array.isArray(response.data)) {
          fetchedCategories = response.data;
        } 
        else if (response.data && Array.isArray(response.data.data)) {
          fetchedCategories = response.data.data;
        } 
        else {
          console.warn("API'den gelen kategori verisi beklendiği gibi bir dizi değil veya bilinmeyen formatta:", response.data);
          fetchedCategories = [];
        }
        
        setCategories(fetchedCategories);
        setLoadingCategories(false);

      } catch (err) {
        console.error('Kategoriler çekilirken hata oluştu:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!newBlog.categoryId) { 
      setFormMessage('Kateqoriya boş qala bilməz.');
      return;
    }

    try {
  
      const response = await axiosInstance.post('/blogs', newBlog); 
      setFormMessage('Blog uğurla yaradıldı!');
      setNewBlog({ 
        title: '',
        content: '',
        image: '',
        categoryId: '',
   k
      });
      navigate(`/blogs/${response.data.data._id}`);
    } catch (err) {
      console.error('Blog yaradılarkən xəta baş verdi:', err.response ? err.response.data : err.message);
      setFormMessage(`Hata: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  if (loadingCategories) {
    return <div className="page-content text-center text-lg font-medium">Kateqoriyalar yüklənir...</div>;
  }

  if (errorCategories) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-4 rounded-md border border-red-400">Kateqoriya yüklənmə xətası: {errorCategories}. Zəhmət olmasa konsolu yoxlayın.</div>;
  }

  return (
    <div className="page-content bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Yeni Blog Yarat</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Başlıq:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Məzmun:</label>
          <textarea
            id="content"
            name="content"
            value={newBlog.content}
            onChange={handleInputChange}
            required
            rows="6"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Şəkil URL'si (Opsiyonel):</label>
          <input
            type="text"
            id="image"
            name="image"
            value={newBlog.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">Kateqoriya:</label>
          <select
            id="categoryId"
            name="categoryId"
            value={newBlog.categoryId}
            onChange={handleInputChange}
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Kateqoriya Seçin</option>
            {Array.isArray(categories) && categories.map(category => ( 
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 w-full"
        >
          Blog Yarat
        </button>
      </form>
      {formMessage && (
        <p className={`mt-4 text-center font-semibold ${formMessage.startsWith('Hata') ? 'text-red-500' : 'text-green-600'}`}>
          {formMessage}
        </p>
      )}
    </div>
  );
}

export default CreateBlogPage;