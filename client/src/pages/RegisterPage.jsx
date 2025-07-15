import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { register } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage('Xahiş edirik bütün sahələri doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Şifrələr uyğun gəlmir.');
      return;
    }

    const result = await register(fullName, email, password); 
    if (!result.success) {
      setMessage(`Qeydiyyat zamanı xəta: ${result.message}`);
    } else {
      setMessage('Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.');
     
    }
  };

  return (
    <div className="page-content bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Qeydiyyat</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Tam Ad:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-poçt:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Şifrə:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Şifrəni Təsdiqlə:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 w-full"
        >
          Qeydiyyatdan Keç
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center font-semibold ${message.includes('xəta') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <p className="mt-6 text-center text-gray-600">
        Artıq hesabınız var? <Link to="/login" className="text-blue-500 hover:underline">Daxil Olun</Link>
      </p>
    </div>
  );
}

export default RegisterPage;