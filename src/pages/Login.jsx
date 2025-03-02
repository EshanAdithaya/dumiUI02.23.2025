import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5137/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify({ email: username, password: password })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store the JWT token (accessToken) in localStorage or cookies
        localStorage.setItem('accessToken', data.accessToken);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl px-12 pt-10 pb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Pharmacy Portal</h1>
            <p className="text-gray-600 mt-2">Inventory Management System</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input 
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" 
              id="username" 
              type="text" 
              required 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" 
              id="password" 
              type="password" 
              required 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center text-gray-500">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-purple-600 mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-purple-600 hover:text-purple-800">Forgot password?</a>
          </div>
          
          <div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Login
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account? 
              <a href="/signup" className="text-purple-600 hover:text-purple-800 ml-1">Signup</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;