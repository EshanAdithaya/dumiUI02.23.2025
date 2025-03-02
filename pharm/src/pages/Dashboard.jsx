import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function Dashboard() {
  const navigate = useNavigate();
  const salesChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (salesChartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = salesChartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Sales',
            data: [12000, 19000, 15000, 22000, 18000, 25000],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleLogout = () => {
    // Clear any auth tokens
    localStorage.removeItem('accessToken');
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="font-sans antialiased bg-[#f4f6f9] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pharmacy Management Dashboard</h1>
            <p className="text-gray-600">Welcome, Admin</p>
          </div>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Drug Inventory Card */}
          <div 
            className="dashboard-card bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:transform hover:translate-y-[-10px] hover:shadow-xl transition duration-300"
            onClick={() => navigate('/drug-inventory')}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Drug Inventory</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 01-4.686-4.686l-.477-2.387a2 2 0 00-.547-1.022L6 5m8 8l-1.535-1.535a2 2 0 00-2.172-.463L8.243 9.19c-.562.267-1.109.61-1.621 1.042C4.241 11.715 2.25 14.189 2.25 17.25c0 3.038 2.44 5.25 5.25 5.25h10.5c2.81 0 5.121-2.212 5.25-5.25.089-2.53-1.411-4.257-2.25-5.035-1.109-.971-2.434-1.452-3.534-1.742z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Total Drugs: <span className="font-bold text-blue-600">145</span></p>
              <p className="text-gray-600">Low Stock Alerts: <span className="font-bold text-red-600">12</span></p>
            </div>
          </div>

          {/* Orders Card */}
          <div 
            className="dashboard-card bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:transform hover:translate-y-[-10px] hover:shadow-xl transition duration-300"
            onClick={() => navigate('/orders')}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Pending Orders: <span className="font-bold text-green-600">24</span></p>
              <p className="text-gray-600">Total Revenue: <span className="font-bold text-purple-600">$45,678</span></p>
            </div>
          </div>

          {/* Suppliers Card */}
          <div 
            className="dashboard-card bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:transform hover:translate-y-[-10px] hover:shadow-xl transition duration-300"
            onClick={() => navigate('/suppliers')}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Suppliers</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.768-.152-1.509-.44-2.192M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.768.152-1.509.44-2.192m0 0a5.002 5.002 0 019.12 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Active Suppliers: <span className="font-bold text-purple-600">18</span></p>
              <p className="text-gray-600">New Requests: <span className="font-bold text-yellow-600">3</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Sales Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Sales</h2>
            <canvas ref={salesChartRef}></canvas>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ul className="divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">New order #1245</span>
                  <span className="text-green-600">Completed</span>
                </div>
              </li>
              <li className="py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Low stock alert: Paracetamol</span>
                  <span className="text-yellow-600">Warning</span>
                </div>
              </li>
              <li className="py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">New supplier registered</span>
                  <span className="text-blue-600">Pending Review</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;