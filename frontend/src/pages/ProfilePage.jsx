import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar'; // Assuming you have this component
import { FiUser, FiMail, FiPhone, FiCalendar, FiKey, FiEdit3, FiSave, FiXCircle,  } from 'react-icons/fi'; // For nicer icons

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    nickname: '',
    email: '',
    phone: '', // Changed to string for easier input handling (can parse to number on submit)
    age: '',   // Changed to string
    gender: 'Not specified',
    token: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state to manage edit mode

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    // Basic validation (add more robust validation as needed)
    if (!profile.nickname || !profile.phone || !profile.age || !profile.gender) {
      alert('Please fill in all editable fields before saving.');
      return;
    }

    // Convert phone and age to numbers if necessary before sending
    const profileToSubmit = {
      ...profile,
      phone: profile.phone ? parseInt(profile.phone, 10) : 0,
      age: profile.age ? parseInt(profile.age, 10) : 0,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/updateprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
      alert('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode on successful save
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile: ' + err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }
        const data = await response.json();
        console.log('Fetched profile data:', data);
        setProfile(data.profile); // Assuming the profile data is nested under 'profile' key
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6 font-sans">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <div className="text-indigo-700 text-xl font-semibold">Loading your profile...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6 font-sans">
          <div className="text-red-700 text-xl font-semibold text-center">
            <FiXCircle className="inline-block mr-2 text-3xl" />
            Error: {error}. Please try again later.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 font-sans relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* This is the key change: Added max-w-5xl (or any max-width you prefer) */}
        <div className="font relative z-10 container mx-auto px-4 py-12 md:py-20 **max-w-5xl**">
          {/* Hero Section */}
          <div className="bg-[url('/profile.jpg')] bg-cover bg-centerbackdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-10 mb-10 text-center border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="font2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-amber-500 to-amber-800 flex items-center justify-center text-white text-6xl md:text-7xl font-bold overflow-hidden shadow-lg mx-auto mb-6 border-4 border-white">
              <span className="relative z-10">
                {profile.nickname ? profile.nickname.charAt(0).toUpperCase() : (profile.username ? profile.username.charAt(0).toUpperCase() : 'U')}
              </span>
              {/*  */}
            </div>
            
            <h1 className="font2 tracking-wide text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
              {profile.nickname || profile.username || 'Your Profile'}
            </h1>
            <p className="text-lg md:text-xl text-white mb-4 flex items-center justify-center">
              <FiMail className="mr-2 text-white shadow-sky-800" /> {profile.email}
            </p>
            
            {profile.token && (
              <div className='bg-orange-800 mx-96 rounded-xl'>
              <p className=" font2 text-lg tracking-wider text-white flex items-center justify-center">
                 <img
                  src="/fire.png"
                  alt="BookHive"
                  className="w-15 h-15 mr-4 "
                />    Token: <span className=" text-2xl font-bold ml-1 select-all">{profile.token}</span>
              </p>
              </div>
            )}
           
          </div>

          {/* Profile Details Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Information Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 transform transition-all duration-300 hover:translate-y-[-5px]">
              <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center">
                <FiUser className="mr-3 text-orange-600" /> Account Information
              </h2>
              <div className="space-y-6 text-amber-700">
                <Field label="Username" value={profile.username} icon={<FiUser />} disabled />
                <Field label="Email" value={profile.email} icon={<FiMail />} disabled />
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 transform transition-all duration-300 hover:translate-y-[-5px]">
              <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center">
                <FiEdit3 className="mr-3 text-orange-600" /> Personal Details
              </h2>
              <div className="space-y-6">
                <Field
                  label="Nickname"
                  name="nickname"
                  value={profile.nickname}
                  onChange={handleChange}
                  icon={<FiUser />}
                  editable={isEditing}
                  placeholder="Your preferred name"
                />

                <Field
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  icon={<FiPhone />}
                  type="tel" // Use tel for phone numbers
                  editable={isEditing}
                  placeholder="e.g., 9876543210"
                />

                <Field
                  label="Age"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  icon={<FiCalendar />}
                  type="number"
                  editable={isEditing}
                  placeholder="e.g., 30"
                />

                <div>
                  <label className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                     Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full px-5 py-3 rounded-xl border ${
                        !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } border-gray-300 focus:ring-3 focus:ring-indigo-400 focus:outline-none appearance-none transition duration-200 shadow-sm pr-10`}
                    >
                      <option value="Not specified">Not specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-12 gap-6">
            <button
              onClick={handleEditToggle}
              className={`py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${
                isEditing
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-300'
              } focus:outline-none focus:ring-4 focus:ring-opacity-50`}
            >
              {isEditing ? (
                <>
                  <FiXCircle className="inline-block mr-2" /> Cancel Edit
                </>
              ) : (
                <>
                  <FiEdit3 className="inline-block mr-2" /> Edit Profile
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={handleSubmit}
                className="py-3 px-8 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 shadow-md"
              >
                <FiSave className="inline-block mr-2" /> Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Re-usable Field component for consistency
const Field = ({ label, value, name, onChange, disabled, editable, type = 'text', placeholder = '', icon }) => (
  <div>
    <label className="text-lg font-medium text-gray-700 mb-2 flex items-center">
      {icon && <span className="mr-2 text-gray-500">{icon}</span>} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled || !editable} // Disabled if explicitly disabled OR not in editable mode
      placeholder={placeholder}
      className={`w-full px-5 py-3 rounded-xl border ${
        disabled || !editable ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      } border-gray-300 focus:ring-3 focus:ring-indigo-400 focus:outline-none transition duration-200 shadow-sm`}
    />
  </div>
);

export default ProfilePage;