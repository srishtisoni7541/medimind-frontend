// src/components/PrescriptionDetail.jsx
import React, { useState, useContext,useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { formatDate } from '../utils/helpers'; // Assume you have this utility function

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const {  backendUrl } = useContext(AppContext);
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('utoken');
        const response = await axios.get(`${backendUrl}/api/user/prescriptions/${id}`, {
          headers: {
           utoken:token
          }
        });
        
        if (response.data.success) {
          setPrescription(response.data.prescription);
        } else {
          setError('Failed to fetch prescription details');
        }
      } catch (error) {
        console.error('Error fetching prescription:', error);
        setError(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrescription();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[15vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Prescription not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-[15vh] mx-auto px-4 py-8 print:py-0">
      <div className="mb-6 print:hidden">
        <Link 
          to="/prescriptions" 
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Prescriptions
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:shadow-none">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Prescription</h1>
          <div className="text-sm text-gray-500">
            Date: {formatDate(prescription.createdAt)}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">Doctor Information</h2>
            <div className="flex items-center space-x-3">
              {prescription.doctorId?.profileImage && (
                <img 
                  src={prescription.doctorId.profileImage} 
                  alt="Doctor" 
                  className="w-14 h-14 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{prescription.doctorId?.firstName} {prescription.doctorId?.lastName}</p>
                <p className="text-sm text-gray-600">{prescription.doctorId?.specialization}</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Date: </span>
              {prescription.appointmentId?.date && formatDate(prescription.appointmentId.date)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Time: </span>
              {prescription.appointmentId?.time}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Diagnosis</h2>
          <p className="p-3 bg-gray-50 rounded-md text-gray-800">{prescription.diagnosis}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Medications</h2>
          
          {prescription.medications && prescription.medications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescription.medications.map((medication, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {medication.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medication.dosage}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medication.frequency}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medication.duration}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {medication.instructions || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 italic">No medications prescribed</p>
          )}
        </div>
        
        {prescription.notes && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Additional Notes</h2>
            <p className="p-3 bg-gray-50 rounded-md text-gray-800">{prescription.notes}</p>
          </div>
        )}
        
        <div className="flex justify-end print:hidden">
          <button 
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;