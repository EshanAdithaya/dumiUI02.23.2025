import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Add other routes as needed */}
        <Route path="/dashboard" element={<div>Dashboard Page (to be implemented)</div>} />
      </Routes>
    </Router>
  );
}

export default App;