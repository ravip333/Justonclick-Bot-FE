import React, { useState, useEffect } from 'react';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    website: '',
    company: '',
    mobile: '',
    documents: '',
    chatLink: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');  // Fetch token from localStorage
  const url = `http://localhost:3001/chat?token=${token}`

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetching profile with token:', token); // Debug log

      if (!token) {
        setError('No token provided. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3050/api/v1/profile/getProfile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status); // Log response status
        const data = await response.json();
        console.log('Profile data:', data); // Log the response data

        if (response.ok) {
          // Ensure to access the "Result" object properly
          const profileData = data.Result || {};

          setProfile({
            name: profileData.name || '',
            email: profileData.email || '',
            website: profileData.websiteUrl || '',
            company: profileData.companyName || '',
            mobile: profileData.mobileNumber || '',
            documents: profileData.documentsUrl || '',
            chatLink: profileData.chatLink || '', // Ensure chatLink is set to empty string if null
          });
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!token) {
      setError('No token provided. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3050/api/v1/profile/updateUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  const handleCopy = () => {
    const inputField = document.getElementById("chatLink");
    inputField.select(); // Select the text in the input field
    navigator.clipboard
      .writeText(inputField.value)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy the URL.");
      });
  };

  return (
    <div className="container">
      <h1>Your Profile</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={profile.name}
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={profile.email}
          disabled
        />
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          value={profile.website}
          onChange={handleChange}
        />
        <label htmlFor="company">Company Name</label>
        <input
          type="text"
          id="company"
          value={profile.company}
          onChange={handleChange}
        />
        <label htmlFor="mobile">Mobile Number</label>
        <input
          type="text"
          id="mobile"
          value={profile.mobile}
          onChange={handleChange}
        />
        <label htmlFor="documents">Documents URL</label>
        <input
          type="text"
          id="documents"
          value={profile.documents}
          onChange={handleChange}
        />
        <label htmlFor="chatLink">Chat Link</label>
       <div>
       <input
          type="text"
          id="chatLink"
          value={url}
          disabled
          onChange={handleChange}
        />
        <button type='button'  onClick={handleCopy}>Copy</button>
       </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfilePage;
