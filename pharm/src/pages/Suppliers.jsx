import { useState, useEffect } from 'react';

function Suppliers() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    supplierName: '',
    licenseNumber: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  
  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: ''
  });
  
  // Sample suppliers data
  const [suppliers] = useState([
    {
      id: 1,
      name: 'MedSupply Inc.',
      licenseNumber: 'LSN-2024-001',
      email: 'contact@medsupply.com',
      phone: '(555) 123-4567',
      address: '',
      status: 'active'
    },
    {
      id: 2,
      name: 'PharmaCorp Ltd.',
      licenseNumber: 'LSN-2024-002',
      email: 'info@pharmacorp.com',
      phone: '(555) 987-6543',
      address: '',
      status: 'inactive'
    }
  ]);
  
  // Filtered suppliers based on search and filters
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters({
      ...filters,
      [id === 'search-input' ? 'searchTerm' : 'status']: value
    });
  };
  
  // Open the modal for adding a new supplier
  const handleAddSupplier = () => {
    setIsEditMode(false);
    setFormData({
      supplierName: '',
      licenseNumber: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };
  
  // Open the modal for editing an existing supplier
  const handleEditSupplier = (supplier) => {
    setIsEditMode(true);
    setFormData({
      id: supplier.id,
      supplierName: supplier.name,
      licenseNumber: supplier.licenseNumber,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address || '',
      status: supplier.status
    });
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create supplier object from form data
    const supplierData = {
      id: formData.id || Math.max(...suppliers.map(s => s.id), 0) + 1,
      name: formData.supplierName,
      licenseNumber: formData.licenseNumber,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      status: formData.status
    };
    
    console.log(isEditMode ? 'Update Supplier:' : 'New Supplier:', supplierData);
    
    // TODO: Implement actual API call to save supplier
    
    // Close modal
    setIsModalOpen(false);
  };
  
  // Filter suppliers based on search term and status
  useEffect(() => {
    const filtered = suppliers.filter(supplier => {
      // Search term filter
      const matchesSearch = 
        supplier.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        supplier.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = !filters.status || supplier.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredSuppliers(filtered);
  }, [filters, suppliers]);
  
  // Get status class based on supplier status
  const getStatusClass = (status) => {
    return status === 'active' 
      ? 'px-2 py-1 rounded text-[#10b981] bg-[#d1fae5]' 
      : 'px-2 py-1 rounded text-[#ef4444] bg-[#fee2e2]';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suppliers Management</h1>
          <p className="text-gray-600">Manage and track pharmaceutical suppliers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleAddSupplier} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Supplier
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Suppliers
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-4">
            <select 
              id="status-filter" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Search suppliers..." 
              value={filters.searchTerm}
              onChange={handleFilterChange}
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
                <th className="p-4 text-left">Supplier Name</th>
                <th className="p-4 text-left">License Number</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{supplier.name}</td>
                  <td className="p-4">{supplier.licenseNumber}</td>
                  <td className="p-4">{supplier.email}</td>
                  <td className="p-4">{supplier.phone}</td>
                  <td className="p-4">
                    <span className={getStatusClass(supplier.status)}>
                      {supplier.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="w-5 h-5" 
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
                      <button 
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="w-5 h-5" 
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
                          className="w-5 h-5" 
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
          <span className="text-gray-600 mb-2 sm:mb-0">Showing 1-{filteredSuppliers.length} of {suppliers.length} suppliers</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-[500px] p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="supplierName">Supplier Name</label>
                  <input 
                    type="text" 
                    id="supplierName" 
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="licenseNumber">License Number</label>
                  <input 
                    type="text" 
                    id="licenseNumber" 
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="supplier-status">Status</label>
                  <select 
                    id="status" 
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2" 
                    required 
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="address">Address</label>
                  <textarea 
                    id="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2" 
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
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
                  {isEditMode ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Suppliers;