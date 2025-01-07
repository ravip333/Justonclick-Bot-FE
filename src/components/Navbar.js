import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  let token = localStorage.getItem('authToken');;

  // Check login state on component mount
  useEffect(() => {
    
    console.log('token nav', token);
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  }, [token]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token
    setIsLoggedIn(false); // Update state
    navigate('/'); // Redirect to the home page or login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="JustOnClick Logo" className="logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        
        {/* Show Profile link only when logged in */}
        {isLoggedIn && <Link to="/profile">Profile</Link>}
        {isLoggedIn && <Link to={`/chat?token=${token}`}>Chat</Link>}

        {/* Conditionally render Sign In or Sign Out */}
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        ) : (
          <Link to="/SignIn">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
