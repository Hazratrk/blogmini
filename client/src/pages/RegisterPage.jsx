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
      setMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const result = await register(fullName, email, password);
    if (!result.success) {
      setMessage(`Registration error: ${result.message}`);
    } else {
      setMessage('Registration completed successfully! You can now log in.');
    }
  };

  return (
    <div className="page-content bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
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
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
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
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
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
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
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
          Register
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center font-semibold ${message.includes('error') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <p className="mt-6 text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;