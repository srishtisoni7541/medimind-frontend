// src/components/PrescriptionsList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { formatDate } from '../utils/helpers'; // Assume you have this utility function
const PrescriptionsLists = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl} = useContext(AppContext);
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('utoken');
        const response = await axios.get(`${backendUrl}/api/user/prescriptions`, {
          headers: {
            utoken:token
          }
        });
        console.log(response);
        
        if (response.data.success) {
          setPrescriptions(response.data.prescriptions);
        } else {
          setError('Failed to fetch prescriptions');
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setError(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen  flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[15vh]">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      
      {prescriptions.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">You don't have any prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
            <Link 
              to={`/prescriptions/${prescription._id}`} 
              key={prescription._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">
                    {prescription.createdAt && formatDate(prescription.createdAt)}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Prescription
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {prescription.diagnosis}
                </h2>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Doctor:</span> {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                  </p>
                  {prescription.medications && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Medications:</span> {prescription.medications.length}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionsLists;