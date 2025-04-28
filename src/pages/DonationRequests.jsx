import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    requestType: '',
    bloodType: '',
    organ: '',
    urgency: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.requestType) queryParams.append('requestType', filters.requestType);
      if (filters.bloodType) queryParams.append('bloodType', filters.bloodType);
      if (filters.organ) queryParams.append('organ', filters.organ);
      if (filters.urgency) queryParams.append('urgency', filters.urgency);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/donations/requests?${queryParams.toString()}`
      );

      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching donation requests:', error);
      toast.error('Failed to load donation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      requestType: '',
      bloodType: '',
      organ: '',
      urgency: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-[15vh]">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Current Donation Requests</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter Requests</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="requestType"
              value={filters.requestType}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Types</option>
              <option value="blood">Blood</option>
              <option value="organ">Organ</option>
            </select>
          </div>

          {filters.requestType === 'blood' && (
            <div>
              <label className="block text-sm font-medium mb-1">Blood Type</label>
              <select
                name="bloodType"
                value={filters.bloodType}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Blood Types</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          )}

          {filters.requestType === 'organ' && (
            <div>
              <label className="block text-sm font-medium mb-1">Organ Type</label>
              <select
                name="organ"
                value={filters.organ}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Organs</option>
                <option value="kidney">Kidney</option>
                <option value="liver">Liver</option>
                <option value="heart">Heart</option>
                <option value="lungs">Lungs</option>
                <option value="pancreas">Pancreas</option>
                <option value="corneas">Corneas</option>
                <option value="tissue">Tissue</option>
                <option value="bone marrow">Bone Marrow</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Urgency</label>
            <select
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Urgencies</option>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Request Listings */}
      {loading ? (
        <div className="text-center p-10">Loading requests...</div>
      ) : requests.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(request => (
            <div 
              key={request._id} 
              className={`bg-white rounded-lg shadow-md p-5 ${
                request.urgency === 'emergency' ? 'border-l-4 border-l-red-500' :
                request.urgency === 'urgent' ? 'border-l-4 border-l-yellow-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                    request.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {request.urgency}
                  </span>
                  <h4 className="font-medium mt-2 text-lg">
                    {request.requestType === 'blood' 
                      ? `Blood Type ${request.bloodType} Needed` 
                      : `${request.organ} Donation Needed`}
                  </h4>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 flex items-center">
                  <span className="font-semibold mr-2">Hospital:</span>
                  {request.hospital.name}
                  {request.hospital.isVerified && (
                    <span className="ml-1 text-blue-600">✓</span>
                  )}
                </p>
                <p className="text-gray-600 flex items-center">
                  <span className="font-semibold mr-2">Posted:</span>
                  {formatDate(request.createdAt)}
                </p>
                {request.preferredDonationDate && (
                  <p className="text-gray-600 flex items-center">
                    <span className="font-semibold mr-2">Preferred Date:</span>
                    {formatDate(request.preferredDonationDate)}
                  </p>
                )}
              </div>
              
              {request.patientCondition && (
                <div className="mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Patient Condition:</span> 
                    <span className="ml-1">{request.patientCondition}</span>
                  </p>
                </div>
              )}
              
              <div className="border-t pt-3">
                <Link 
                  to={`/donation-request/${request._id}/${request.hospital._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">No donation requests match your filters.</p>
          {Object.values(filters).some(filter => filter !== '') && (
            <button
              onClick={clearFilters}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;