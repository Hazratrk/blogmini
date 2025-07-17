//ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; 
import { useAuth } from '../context/AuthContext'; 

function ProfilePage() {
  const { user, updateUser, logout } = useAuth(); 
  const [profileData, setProfileData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true); 
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');



  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { 
        setLoadingPage(false);
        setError('You must be logged in to view this page.');
        return;
      }
      try {
        setLoadingPage(true);
        setError(null);
        const response = await axiosInstance.get('/auth/me'); 
        setProfileData(response.data.data);
        setFormData({
          fullName: response.data.data.fullName,
          email: response.data.data.email,
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response ? err.response.data.message : 'Failed to load profile.');

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout(); 
        }
      } finally {
        setLoadingPage(false);
      }
    };

    fetchProfile();
  }, [user, logout]); 


 
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordFormData({ ...passwordFormData, [e.target.name]: e.target.value });
  };


  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    try {
      const response = await axiosInstance.put('/auth/updateprofile', formData);
      setProfileData(response.data.data); 
      updateUser(response.data.data); 
      setProfileMessage('Profile updated successfully!');
      setEditMode(false); 
    } catch (err) {
      console.error('Error updating profile:', err);
      setProfileMessage(`Error: ${err.response ? err.response.data.message : 'Failed to update profile.'}`);
    }
  };


  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordMessage('New passwords do not match!');
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
        setPasswordMessage('New password must be at least 6 characters long!');
        return;
    }

    try {
      await axiosInstance.put('/auth/updatepassword', passwordFormData);
      setPasswordMessage('Password updated successfully! Please log in again if prompted.');
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      logout(); 
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordMessage(`Error: ${err.response ? err.response.data.message : 'Failed to update password.'}`);
    }
  };


  if (loadingPage) { 
    return <div className="page-content text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="page-content text-center text-red-500">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="page-content text-center">No profile data available. Please log in.</div>;
  }

  return (
    <div className="page-content bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Your Profile</h1>


      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Details</h2>
        <p className="text-gray-700 text-lg mb-2">
          <span className="font-medium">Full Name:</span> {profileData.fullName}
        </p>
        <p className="text-gray-700 text-lg mb-2">
          <span className="font-medium">Email:</span> {profileData.email}
        </p>
        <p className="text-gray-700 text-lg mb-2">
          <span className="font-medium">Role:</span> {profileData.role}
        </p>
        <p className="text-gray-700 text-lg mb-2">
          <span className="font-medium">Registered On:</span> {new Date(profileData.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 text-lg">
          <span className="font-medium">Blogs Posted:</span> {profileData.blogCount !== undefined ? profileData.blogCount : 'N/A'}
        </p>
        <button
          onClick={() => setEditMode(!editMode)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          {editMode ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

  
      {editMode && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleProfileChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Save Profile
            </button>
            {profileMessage && (
              <p className={`mt-2 text-center ${profileMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {profileMessage}
              </p>
            )}
          </form>
        </div>
      )}


      <div className="p-6 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordFormData.currentPassword}
              onChange={handlePasswordChange}
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordFormData.newPassword}
              onChange={handlePasswordChange}
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordFormData.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Change Password
          </button>
          {passwordMessage && (
            <p className={`mt-2 text-center ${passwordMessage.startsWith('Error') || passwordMessage.startsWith('New passwords do not match') || passwordMessage.startsWith('New password must be') ? 'text-red-600' : 'text-green-600'}`}>
              {passwordMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;