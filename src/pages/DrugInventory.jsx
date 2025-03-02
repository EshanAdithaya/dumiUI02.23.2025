import { useState, useEffect } from 'react';

function DrugInventory() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    drugName: '',
    genericName: '',
    category: 'Pain Relief',
    unitPrice: '',
    currentStock: ''
  });
  // State for filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    stockStatus: ''
  });

  // Sample drug data
  const [drugs] = useState([
    {
      id: 1,
      drugName: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      category: 'Pain Relief',
      unitPrice: 5.99,
      stock: 250
    },
    {
      id: 2,
      drugName: 'Amoxicillin',
      genericName: 'Amoxicillin Trihydrate',
      category: 'Antibiotics',
      unitPrice: 12.50,
      stock: 45
    }
  ]);

  // Filtered drugs based on search and filters
  const [filteredDrugs, setFilteredDrugs] = useState(drugs);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement drug addition/editing logic
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      drugName: '',
      genericName: '',
      category: 'Pain Relief',
      unitPrice: '',
      currentStock: ''
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Filter drugs based on search term and filters
  useEffect(() => {
    const filtered = drugs.filter(drug => {
      // Search term filter
      const matchesSearch = drug.drugName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            drug.genericName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !filters.category || drug.category.toLowerCase().includes(filters.category.toLowerCase());
      
      // Stock status filter
      const matchesStock = !filters.stockStatus || 
                          (filters.stockStatus === 'low' && drug.stock < 100) || 
                          (filters.stockStatus === 'adequate' && drug.stock >= 100);
      
      return matchesSearch && matchesCategory && matchesStock;
    });
    
    setFilteredDrugs(filtered);
  }, [filters, drugs]);

  // Determine stock status class
  const getStockStatusClass = (stock) => {
    return stock < 100 
      ? 'px-2 py-1 rounded bg-yellow-100 text-yellow-800' 
      : 'px-2 py-1 rounded bg-green-100 text-green-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Drug Inventory</h1>
          <p className="text-gray-600">Manage and track pharmaceutical inventory</p>
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
            Add New Drug
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            >
              <option value="">All Categories</option>
              <option value="pain-relief">Pain Relief</option>
              <option value="antibiotics">Antibiotics</option>
              <option value="cardiovascular">Cardiovascular</option>
            </select>
            <select 
              name="stockStatus" 
              value={filters.stockStatus} 
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            >
              <option value="">Stock Status</option>
              <option value="low">Low Stock</option>
              <option value="adequate">Adequate Stock</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search drugs..." 
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
                <th className="p-4 text-left">Drug Name</th>
                <th className="p-4 text-left">Generic Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Unit Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrugs.map(drug => (
                <tr key={drug.id} className="table-row border-b hover:bg-gray-50">
                  <td className="p-4">{drug.drugName}</td>
                  <td className="p-4">{drug.genericName}</td>
                  <td className="p-4">{drug.category}</td>
                  <td className="p-4">${drug.unitPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={getStockStatusClass(drug.stock)}>{drug.stock}</span>
                  </td>
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
          <span className="text-gray-600 mb-2 sm:mb-0">Showing 1-{filteredDrugs.length} of {drugs.length} drugs</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Drug Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add New Drug</h2>
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
                <label className="block text-gray-700 mb-2">Drug Name</label>
                <input 
                  type="text" 
                  name="drugName"
                  value={formData.drugName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Generic Name</label>
                <input 
                  type="text" 
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option>Pain Relief</option>
                  <option>Antibiotics</option>
                  <option>Cardiovascular</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Unit Price</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Current Stock</label>
                <input 
                  type="number" 
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2" 
                  required 
                />
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrugInventory;