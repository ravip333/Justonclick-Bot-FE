import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to Just OnClick</h1>
        <p>Your one-stop platform for seamless communication and services.</p>
        <div className="links">
          <Link to="/signin" className="btn">Sign In</Link>
          <Link to="/signup" className="btn">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
