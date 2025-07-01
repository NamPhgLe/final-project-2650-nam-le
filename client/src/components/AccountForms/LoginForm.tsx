import React, { useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/member/signin', {
        email: emailOrUsername.includes('@') ? emailOrUsername : undefined,
        username: !emailOrUsername.includes('@') ? emailOrUsername : undefined,
        password,
      });

      if (response.data.error) {
        setMessage(response.data.error);
      } else {
        setMessage(response.data.success);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '1rem' }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Username"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={handleLogin} style={{ width: '100%' }}>
        Login
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default LoginForm;
