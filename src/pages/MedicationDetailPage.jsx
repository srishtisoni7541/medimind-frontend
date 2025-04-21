import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMedicationDetails } from '../services/apimedi';

const MedicationDetailPage = () => {
  const { name } = useParams();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('uses');

  useEffect(() => {
    const fetchMedicationDetails = async () => {
      setLoading(true);
      try {
        const response = await getMedicationDetails(name);
        setMedication(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching medication details:', error);
        setError('Failed to load medication details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationDetails();
  }, [name]);

  const tabContent = {
    uses: {
      title: 'Uses',
      content: medication?.uses || [],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    sideEffects: {
      title: 'Side Effects',
      content: medication?.sideEffects || [],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    warnings: {
      title: 'Warnings & Precautions',
      content: medication?.warnings || [],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    dosage: {
      title: 'Missed Dose / Overdose',
      content: [
        medication?.missedDose || "Information not available",
        medication?.overdose || "Information not available"
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-primary text-white p-6">
            <h1 className="text-3xl font-bold">{medication?.name || name}</h1>
            <p className="mt-2 text-blue-100">{medication?.description || ''}</p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 inline-flex items-center justify-center py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tabContent[tab].icon}</span>
                  {tabContent[tab].title}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{tabContent[activeTab].title}</h2>
            
            {Array.isArray(tabContent[activeTab].content) ? (
              <ul className="space-y-3">
                {tabContent[activeTab].content.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{tabContent[activeTab].content}</p>
            )}
            </div>
            {activeTab === 'dosage' && (
            <div className="p-6 bg-blue-50 mt-4 rounded-md mx-6 mb-6">
              <div className="flex items-start mb-4">
                <div className="bg-primary rounded-full p-2 text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Missed Dose</h3>
                  <p>{medication?.missedDose || "No information available about missed dose."}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-500 rounded-full p-2 text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Overdose</h3>
                  <p>{medication?.overdose || "No information available about overdose."}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-t border-gray-200">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    The information provided is for educational purposes only and is not intended as medical advice. 
                    Consult a healthcare professional before taking any medication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailPage;