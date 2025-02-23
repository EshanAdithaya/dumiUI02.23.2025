import React, { useState } from 'react';

// Authentication service to handle API calls
const AuthService = {
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:5137/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(email, password, firstName, lastName) {
    try {
      const response = await fetch('http://localhost:5137/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

// Authentication Component
function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const result = await AuthService.login(loginEmail, loginPassword);
      setSuccess('Login successful!');
      // Store tokens, redirect, etc.
      console.log('Login result:', result);
      // Example of storing tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const result = await AuthService.register(
        registerEmail, 
        registerPassword, 
        firstName, 
        lastName
      );
      setSuccess('Registration successful!');
      // Store tokens, redirect, etc.
      console.log('Registration result:', result);
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={`w-1/2 py-2 text-center ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-center ${activeTab === 'register' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input 
                id="login-email"
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required 
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input 
                id="login-password"
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required 
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input 
                  id="first-name"
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input 
                  id="last-name"
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input 
                id="register-email"
                type="email" 
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required 
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input 
                id="register-password"
                type="password" 
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required 
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;