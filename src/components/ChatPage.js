import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ChatPage.css';
import { useLocation } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const currentLocation = useLocation();
  const queryParams = new URLSearchParams(currentLocation.search);
  const token = queryParams.get('token');

  const isEmbedded = window !== window.top; // Check if the page is embedded

  useEffect(() => {
    // Create a unique ID for the user when the page loads
    const uniqueUserId = localStorage.getItem('userId') || generateUserId();
    setUserId(uniqueUserId);
    localStorage.setItem('userId', uniqueUserId);
  }, []);

  // Generate a unique user ID
  const generateUserId = () => {
    const userId = `user-${Date.now()}`;
    return userId;
  };

  // Send message to the API
  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setLoading(true);
    setUserInput('');

    const apiUrl = 'http://localhost:3050/api/v1/scrape/scrape-websites/';

    try {
      const response = await axios.post(
        apiUrl,
        {
          message: userInput, // User's input
          From: 'web-client',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('RES', response);

      // Add response from API to messages
      const botMessage = response.data.response || 'Sorry, I didn\'t understand that.';
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Something went wrong. Please try again.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {!isEmbedded && <h1 className="chat-header">Chat with JustOnClick</h1>}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <span className="sender">{msg.sender}:</span> {msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something..."
            disabled={loading}
            onKeyDown={handleKeyPress}  // Add the keydown event to trigger Enter press
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
