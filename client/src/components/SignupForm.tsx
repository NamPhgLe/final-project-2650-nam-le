import React, { useState } from 'react';

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

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<ServerResponse | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/member/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: ServerResponse = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Signup error:', error);
      setResponse({ error: 'Something went wrong. Please try again later.' });
    }
  };

  return (
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
      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </form>
  );
};

export default SignupForm;
