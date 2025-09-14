import React, { useState } from 'react';
import type { User, Role } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './common/Card';
import { Spinner } from './common/Spinner';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Use an environment variable for the API base URL.
// This is a placeholder and should be configured in your deployment environment.
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isRegistering && (!name || !email || !password)) {
      setError('All fields are required for registration.');
      setIsLoading(false);
      return;
    }

    if (!isRegistering && (!email || !password)) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    const endpoint = isRegistering ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
    const payload = isRegistering ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }
      
      // Assuming the backend returns a user object on successful login/registration
      // e.g., { id: '...', name: '...', email: '...', role: '...' }
      onLogin(data.user);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{isRegistering ? 'Create an Account' : 'Welcome Back!'}</CardTitle>
            <CardDescription>
              {isRegistering ? 'Enter your details to register.' : 'Log in to access the healthcare bot.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Full Name"
                  disabled={isLoading}
                />
              )}
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email Address"
                disabled={isLoading}
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : (isRegistering ? 'Register' : 'Login')}
              </Button>
            </form>
             <p className="mt-6 text-center text-sm text-slate-600">
                Login with your registered account or use the demo admin account.
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-sm text-teal-600 hover:text-teal-500 font-medium"
                disabled={isLoading}
              >
                {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;