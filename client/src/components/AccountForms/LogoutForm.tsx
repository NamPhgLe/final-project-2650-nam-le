import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePopup } from '../Layout/PopupContext';

const LogoutForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/member/signout`, {}, { withCredentials: true });
      showPopup('Login Out Successful!');
      navigate('/home');
    } catch (error) {
      setMessage('Error logging out. Please try again.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '1rem' }}>
      <h2>Logout</h2>
      <button onClick={handleLogout} style={{ width: '100%', marginBottom: '1rem' }}>
        Logout
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LogoutForm;
