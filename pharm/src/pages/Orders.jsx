import { useState, useEffect } from 'react';

function Orders() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    date: ''
  });
  
  // State for order items in the form
  const [orderItems, setOrderItems] = useState([
    { id: 1, drug: '', quantity: 1 }
  ]);
  
  // State for form data
  const [formData, setFormData] = useState({
    pharmacy: '',
  });
  
  // Sample order data
  const [orders] = useState([
    {
      id: "#1245",
      pharmacy: "City Pharmacy",
      totalAmount: 1245.50,
      status: "pending",
      date: "2024-02-15"
    },
    {
      id: "#1246",
      pharmacy: "Health Center Pharmacy",
      totalAmount: 2345.75,
      status: "completed",
      date: "2024-02-16"
    }
  ]);
  
  // Filtered orders based on search and filters
  const [filteredOrders, setFilteredOrders] = useState(orders);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Filter orders based on search term and filters
  useEffect(() => {
    const filtered = orders.filter(order => {
      // Search term filter
      const matchesSearch = 
        order.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        order.pharmacy.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = !filters.status || order.status === filters.status;
      
      // Date filter
      const matchesDate = !filters.date || order.date === filters.date;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    setFilteredOrders(filtered);
  }, [filters, orders]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle order item input changes
  const handleOrderItemChange = (id, field, value) => {
    const updatedOrderItems = orderItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setOrderItems(updatedOrderItems);
  };
  
  // Add new order item
  const addOrderItem = () => {
    const newId = Math.max(...orderItems.map(item => item.id), 0) + 1;
    setOrderItems([...orderItems, { id: newId, drug: '', quantity: 1 }]);
  };
  
  // Remove order item
  const removeOrderItem = (id) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create order object from form data
    const newOrder = {
      pharmacy: formData.pharmacy,
      orderItems: orderItems.map(item => ({
        drug: item.drug,
        quantity: item.quantity
      }))
    };
    
    console.log('New Order:', newOrder);
    
    // Close modal and reset form
    setIsModalOpen(false);
    setFormData({ pharmacy: '' });
    setOrderItems([{ id: 1, drug: '', quantity: 1 }]);
  };
  
  // Determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'px-2 py-1 rounded text-[#d97706] bg-[#fef3c7]';
      case 'completed':
        return 'px-2 py-1 rounded text-[#10b981] bg-[#d1fae5]';
      case 'cancelled':
        return 'px-2 py-1 rounded text-[#ef4444] bg-[#fee2e2]';
      default:
        return 'px-2 py-1 rounded';
    }
  };
  
  // Format status text
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600">Track and manage pharmacy orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Order
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Orders
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input 
              type="date" 
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search orders..." 
              className="border rounded-full px-4 py-2 pl-8 w-full"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute left-2 top-3 h-4 w-4 text-gray-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Pharmacy</th>
                <th className="p-4 text-left">Total Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.pharmacy}</td>
                  <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={getStatusClass(order.status)}>{formatStatus(order.status)}</span>
                  </td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center">
          <span className="text-gray-600 mb-2 sm:mb-0">Showing 1-{filteredOrders.length} of {orders.length} orders</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      {/* Create/Edit Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-[600px] p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create New Order</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Pharmacy</label>
                <select 
                  name="pharmacy"
                  value={formData.pharmacy}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2" 
                  required
                >
                  <option value="">Select Pharmacy</option>
                  <option value="City Pharmacy">City Pharmacy</option>
                  <option value="Health Center Pharmacy">Health Center Pharmacy</option>
                </select>
              </div>
              <div id="order-items-container">
                {orderItems.map(item => (
                  <div key={item.id} className="order-item mb-4 bg-gray-50 p-4 rounded">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Drug</label>
                        <select 
                          value={item.drug}
                          onChange={(e) => handleOrderItemChange(item.id, 'drug', e.target.value)}
                          className="w-full border rounded px-3 py-2" 
                          required
                        >
                          <option value="">Select Drug</option>
                          <option value="Aspirin">Aspirin</option>
                          <option value="Amoxicillin">Amoxicillin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Quantity</label>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleOrderItemChange(item.id, 'quantity', e.target.value)}
                          className="w-24 border rounded px-3 py-2" 
                          min="1" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Actions</label>
                        <button 
                          type="button" 
                          onClick={() => removeOrderItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <button 
                  type="button" 
                  onClick={addOrderItem}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Another Drug
                </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;