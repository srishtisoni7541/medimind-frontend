import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DonationRequestDetails = () => {
  const { requestId, hospitalId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedulingDonation, setSchedulingDonation] = useState(false);
  const [donationDate, setDonationDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('utoken');
        const headers = token ? { utoken: token } : {};

        // Fetch request details
        const requestRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/donations/requests/${requestId}`,
        );
        setRequest(requestRes.data.request);

        // Fetch hospital details
        const hospitalRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/get-hospital/${hospitalId}`
        );
        setHospital(hospitalRes.data.hospital);

        // Check if user is registered as donor
        if (token) {
          try {
            const donorRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/donations/donors/profile`,
              { headers }
            );
            setDonor(donorRes.data.donor);
          } catch (error) {
            // Not registered as donor - that's fine
            console.log('User not registered as donor');
          }
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        toast.error(error.response?.data?.message || 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId, hospitalId]);

  const handleScheduleDonation = async (e) => {
    e.preventDefault();
    
    if (!donor) {
      toast.error('You must be registered as a donor to schedule a donation');
      return;
    }
    
    try {
      setSchedulingDonation(true);
      const token = localStorage.getItem('utoken');
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/donations/donations/schedule?hospitalId=${hospitalId}`,
        {
          donorId: donor._id,
          requestId: request._id,
          donationType: request.requestType,
          bloodType: request.requestType === 'blood' ? request.bloodType : undefined,
          organ: request.requestType === 'organ' ? request.organ : undefined,
          donationDate,
          notes
        },
        { headers: { utoken: token } }
      );
      
      toast.success('Donation scheduled successfully');
      navigate('/donor-dashboard');
    } catch (error) {
      console.error('Error scheduling donation:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule donation');
    } finally {
      setSchedulingDonation(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const checkEligibility = () => {
    if (!donor) return false;
    
    if (!donor.available) return false;
    
    if (request.requestType === 'blood') {
      return donor.bloodType === request.bloodType;
    } else if (request.requestType === 'organ') {
      return donor.organDonor && donor.organs.includes(request.organ);
    }
    
    return false;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10">Loading request details...</div>;
  }

  if (!request || !hospital) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <p className="mb-4">The donation request you're looking for doesn't exist or has expired.</p>
        <Link 
          to="/donation-requests" 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          View All Requests
        </Link>
      </div>
    );
  }

  const isEligible = checkEligibility();
  
  return (
    <div className="max-w-4xl mx-auto p-4 pt-[15vh]">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
              </span>
              <h1 className="text-2xl font-bold mt-2">
                {request.requestType === 'blood' 
                  ? `Blood Type ${request.bloodType} Donation Request` 
                  : `${request.organ} Donation Request`}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Posted on {formatDate(request.createdAt)}</p>
              {request.expiresAt && (
                <p className="text-red-500 text-sm">
                  Expires on {formatDate(request.expiresAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Hospital Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-lg">{hospital.name}</h3>
              <p className="text-gray-600">{hospital.address}</p>
              <p className="text-gray-600">{hospital.phone}</p>
              {hospital.isVerified && (
                <p className="text-green-600 mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Hospital
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Request Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><span className="font-medium">Type:</span> {request.requestType === 'blood' ? 'Blood Donation' : 'Organ Donation'}</p>
              {request.requestType === 'blood' && (
                <p><span className="font-medium">Blood Type:</span> {request.bloodType}</p>
              )}
              {request.requestType === 'organ' && (
                <p><span className="font-medium">Organ:</span> {request.organ}</p>
              )}
              {request.patientCondition && (
                <p className="mt-2"><span className="font-medium">Patient Condition:</span> {request.patientCondition}</p>
              )}
              {request.preferredDonationDate && (
                <p><span className="font-medium">Preferred Donation Date:</span> {formatDate(request.preferredDonationDate)}</p>
              )}
            </div>
          </div>
        </div>

        {request.notes && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Additional Notes</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-line">{request.notes}</p>
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          {!donor ? (
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="font-medium">Want to help?</p>
              <p className="mb-3">Sign up as a donor to respond to this request.</p>
              <Link 
                to="/donor-registration" 
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Register as Donor
              </Link>
            </div>
          ) : !isEligible ? (
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="font-medium">Not Eligible</p>
              <p>
                {!donor.available 
                  ? "You're currently marked as unavailable for donations." 
                  : `Your donor profile doesn't match the requirements for this ${request.requestType} donation.`}
              </p>
              <Link 
                to="/donor-dashboard" 
                className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                View Your Donor Dashboard
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-3">Schedule Your Donation</h2>
              <form onSubmit={handleScheduleDonation} className="bg-gray-50 p-4 rounded-md">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Donation Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    max={request.expiresAt ? new Date(request.expiresAt).toISOString().split('T')[0] : ''}
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information you'd like to share with the hospital..."
                  ></textarea>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    disabled={schedulingDonation}
                    className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {schedulingDonation ? 'Scheduling...' : 'Schedule Donation'}
                  </button>
                  <Link 
                    to="/donor-dashboard" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;