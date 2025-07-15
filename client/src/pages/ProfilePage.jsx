// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path if necessary
import { useAuth } from '../context/AuthContext'; // To get token for authenticated requests

function ProfilePage() {
  const { user: authUser, logout } = useAuth(); // Get user from AuthContext
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        setProfile(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (authUser) { // Only fetch if user is authenticated
      fetchProfile();
    } else {
      setLoading(false);
      setError("Please log in to view your profile.");
    }
  }, [authUser]); // Refetch if authUser changes

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordChangeMessage('');
    setPasswordChangeError('');
    setIsPasswordChanging(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      setIsPasswordChanging(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordChangeError('New password must be at least 6 characters long.');
      setIsPasswordChanging(false);
      return;
    }

    try {
      await axiosInstance.put('/users/profile/password', { currentPassword, newPassword });
      setPasswordChangeMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Error changing password:', err.response ? err.response.data : err.message);
      setPasswordChangeError(err.response ? err.response.data.message : 'Failed to change password.');
    } finally {
      setIsPasswordChanging(false);
    }
  };

  if (loading) {
    return <div className="page-content text-center text-xl font-medium text-gray-700">Loading profile...</div>;
  }

  if (error) {
    return <div className="page-content error-message text-center text-red-600 font-bold bg-red-100 p-6 rounded-lg border border-red-400">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="page-content text-center text-gray-700 text-xl">Profile data not available.</div>;
  }

  return (
    <div className="page-content bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">User Profile</h1>

      <div className="space-y-4 text-lg text-gray-700 mb-10">
        <p><span className="font-semibold text-gray-800">Full Name:</span> {profile.fullName}</p>
        <p><span className="font-semibold text-gray-800">Email:</span> {profile.email}</p>
        <p><span className="font-semibold text-gray-800">Registered On:</span> {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><span className="font-semibold text-gray-800">Blogs Created:</span> {profile.blogCount}</p>
      </div>

      <hr className="my-8 border-gray-200" />

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Change Password</h2>
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={isPasswordChanging}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPasswordChanging ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
      {passwordChangeMessage && (
        <p className="mt-4 text-center font-semibold text-green-600 text-lg">{passwordChangeMessage}</p>
      )}
      {passwordChangeError && (
        <p className="mt-4 text-center font-semibold text-red-600 text-lg">{passwordChangeError}</p>
      )}
    </div>
  );
}

export default ProfilePage;