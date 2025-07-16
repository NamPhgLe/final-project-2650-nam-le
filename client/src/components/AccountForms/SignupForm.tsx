import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../Layout/PopupContext';

import { useEffect } from 'react';
interface SuccessResponse {
  success: {
    email: string;
    message: string;
  };
}

interface ErrorResponse {
  error: string;
}

type ServerResponse = SuccessResponse | ErrorResponse;

const SignupForm: React.FC<{ setLoggedIn: (value: boolean) => void }> = ({ setLoggedIn }) => {  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/api/member/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data: ServerResponse = await res.json();

      if ('success' in data) {
        showPopup('Sign Up Successful!');
        setLoggedIn(true);
        navigate('/');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
        {message && (
          <pre>{message}</pre>
        )}
      </form>
    </>
  );
};

export default SignupForm;
