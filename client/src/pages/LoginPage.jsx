import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Xahiş edirik bütün sahələri doldurun.');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setMessage(`Giriş zamanı xəta: ${result.message}`);
    }
    
  };

  return (
    <div className="page-content bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Daxil Ol</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 w-full"
        >
          Daxil Ol
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center font-semibold ${message.includes('xəta') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <p className="mt-6 text-center text-gray-600">
        Hesabınız yoxdur? <Link to="/register" className="text-blue-500 hover:underline">Qeydiyyatdan keçin</Link>
      </p>
    </div>
  );
}

export default LoginPage;