import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

function Dashboard() {
  const navigate = useNavigate();
  const salesChartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // State for user info
  const [userInfo, setUserInfo] = useState({
    email: '',
    roles: []
  });
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    drugCount: 0,
    lowStockCount: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeSuppliers: 0,
    newRequests: 0
  });
  
  // State for recent activities
  const [recentActivities, setRecentActivities] = useState([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State for error
  const [error, setError] = useState('');
  
  // State for sales data
  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [0, 0, 0, 0, 0, 0]
  });

  // Get user info from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email');
    const rolesStr = localStorage.getItem('roles');
    
    if (email) {
      let roles = [];
      try {
        roles = JSON.parse(rolesStr) || [];
      } catch (error) {
        console.error('Error parsing roles:', error);
      }
      
      setUserInfo({
        email,
        roles
      });
    } else {
      // Redirect to login if not authenticated
      navigate('/');
    }
  }, [navigate]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('accessToken');
        
        // Fetch drug inventory stats
        const drugsResponse = await fetch('http://localhost:5137/api/v1/DrugInventory', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/plain'
          }
        });
        
        if (!drugsResponse.ok) {
          throw new Error('Failed to fetch drug inventory data');
        }
        
        const drugsData = await drugsResponse.json();
        
        // Fetch orders
        const ordersResponse = await fetch('http://localhost:5137/api/v1/Orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/plain'
          }
        });
        
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders data');
        }
        
        const ordersData = await ordersResponse.json();
        
        // Fetch suppliers
        const suppliersResponse = await fetch('http://localhost:5137/api/v1/Suppliers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/plain'
          }
        });
        
        if (!suppliersResponse.ok) {
          throw new Error('Failed to fetch suppliers data');
        }
        
        const suppliersData = await suppliersResponse.json();
        
        // Calculate dashboard metrics using the correct drug data structure
        const lowStockItems = drugsData.filter(drug => drug.minimumStock < drug.minimumStock);
        const pendingOrders = ordersData.filter(order => order.status === 0);
        const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
        const activeSuppliers = suppliersData.filter(supplier => supplier.status === 0);
        
        // Update dashboard data
        setDashboardData({
          drugCount: drugsData.length,
          lowStockCount: lowStockItems.length,
          pendingOrders: pendingOrders.length,
          totalRevenue: totalRevenue,
          activeSuppliers: activeSuppliers.length,
          newRequests: 0 // Placeholder since we don't have this data
        });
        
        // Create recent activities list with correct drug data structure
        const activities = [
          ...pendingOrders.slice(0, 3).map(order => ({
            text: `New order #${order.id}`,
            status: 'Pending',
            statusColor: 'yellow'
          })),
          ...lowStockItems.slice(0, 3).map(drug => ({
            text: `Low stock alert: ${drug.name}`,
            status: 'Warning',
            statusColor: 'red'
          }))
        ];
        
        // Sort by most recent (assuming we would have timestamps)
        setRecentActivities(activities.slice(0, 5));
        
        // Generate sales data (mock data since we don't have this yet)
        // In a real application, this would come from an API endpoint
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        const last6MonthsData = [];
        
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          last6Months.push(monthNames[monthIndex]);
          
          // Calculate total sales for this month (simplified)
          const monthOrders = ordersData.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === monthIndex;
          });
          
          const monthSales = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
          last6MonthsData.push(monthSales);
        }
        
        setSalesData({
          labels: last6Months,
          data: last6MonthsData
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if user is authenticated
    if (userInfo.email) {
      fetchDashboardData();
    }
  }, [userInfo.email]);
  
  // Initialize chart
  useEffect(() => {
    if (salesChartRef.current && !isLoading) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = salesChartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: salesData.labels,
          datasets: [{
            label: 'Monthly Sales',
            data: salesData.data,
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
  }, [salesData, isLoading]);

  const handleLogout = () => {
    // Clear all auth tokens and user info
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
    
    // Redirect to login page
    navigate('/');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get role display
  const getRoleDisplay = () => {
    if (!userInfo.roles || userInfo.roles.length === 0) return 'User';
    
    // Convert role names to title case
    return userInfo.roles.map(role => 
      role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    ).join(', ');
  };

  return (
    <div className="font-sans antialiased bg-[#f4f6f9] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pharmacy Management Dashboard</h1>
            <div className="text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{userInfo.email}</span> • 
              <span className="ml-1 text-blue-600">{getRoleDisplay()}</span>
            </div>
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

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-2">Loading dashboard data...</p>
          </div>
        ) : (
          <>
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
                  <p className="text-gray-600">Total Drugs: <span className="font-bold text-blue-600">{dashboardData.drugCount}</span></p>
                  <p className="text-gray-600">Low Stock Alerts: <span className="font-bold text-red-600">{dashboardData.lowStockCount}</span></p>
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
                  <p className="text-gray-600">Pending Orders: <span className="font-bold text-green-600">{dashboardData.pendingOrders}</span></p>
                  <p className="text-gray-600">Total Revenue: <span className="font-bold text-purple-600">{formatCurrency(dashboardData.totalRevenue)}</span></p>
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
                  <p className="text-gray-600">Active Suppliers: <span className="font-bold text-purple-600">{dashboardData.activeSuppliers}</span></p>
                  <p className="text-gray-600">New Requests: <span className="font-bold text-yellow-600">{dashboardData.newRequests}</span></p>
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
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent activities</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentActivities.map((activity, index) => (
                      <li key={index} className="py-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{activity.text}</span>
                          <span className={`text-${activity.statusColor}-600`}>{activity.status}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;