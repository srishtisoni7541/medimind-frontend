import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DonorDashboard = () => {
  const [donorProfile, setDonorProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const token = localStorage.getItem("utoken");
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const headers = { utoken: token };

        // Get donor profile
        const profileRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/donations/donors/profile`,
          { headers }
        );
        setDonorProfile(profileRes.data.donor);

        // Get donor's donations
        const donationsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/donations/donors/donations`,
          { headers }
        );
        setDonations(donationsRes.data.donations);

        // Get public donation requests
        const requestsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/donations/requests`
        );

        setRequests(requestsRes.data.requests);
      } catch (error) {
        console.error("Error fetching donor data:", error);
        toast.error(
          error.response?.data?.message || "Failed to load donor data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, []);

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem("utoken");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/donations/donors/availability`,
        { available: !donorProfile.available },
        { headers: { utoken: token } }
      );

      setDonorProfile((prev) => ({ ...prev, available: !prev.available }));
      toast.success(
        `You are now ${
          !donorProfile.available ? "available" : "unavailable"
        } for donation`
      );
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">Loading donor dashboard...</div>
    );
  }

  if (!donorProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Donor Registration Required</h2>
        <p className="mb-4">
          You need to register as a donor to access this dashboard.
        </p>
        <Link
          to="/donor-registration"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Register as Donor
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-[15vh]">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Donor Dashboard</h2>
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-md ${
              donorProfile.available
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {donorProfile.available
              ? "Available for Donation"
              : "Currently Unavailable"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3">Donor Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Blood Type:</span>{" "}
                {donorProfile.bloodType}
              </p>
              <p>
                <span className="font-medium">Organ Donor:</span>{" "}
                {donorProfile.organDonor ? "Yes" : "No"}
              </p>

              {donorProfile.organDonor && donorProfile.organs.length > 0 && (
                <div>
                  <p className="font-medium">Organs for donation:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {donorProfile.organs.map((organ) => (
                      <span
                        key={organ}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {organ}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {donorProfile.lastDonated && (
                <p>
                  <span className="font-medium">Last Donated:</span>{" "}
                  {formatDate(donorProfile.lastDonated)}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Link
                to="/donor-profile-edit"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3">Health Information</h3>

            {donorProfile.medicalConditions.length > 0 ? (
              <div className="mb-3">
                <p className="font-medium">Medical Conditions:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {donorProfile.medicalConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-3">No medical conditions listed</p>
            )}

            {donorProfile.medications.length > 0 ? (
              <div>
                <p className="font-medium">Current Medications:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {donorProfile.medications.map((medication, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {medication}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No medications listed</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming and Past Donations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Donations</h3>

        {donations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(donation.donationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.donationType === "blood"
                        ? `Blood (${donation.bloodType})`
                        : `Organ (${donation.organ})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.hospital.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          donation.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : donation.status === "scheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">You haven't made any donations yet.</p>
        )}
      </div>

      {/* Current Donation Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          Current Donation Requests
        </h3>

        {requests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.slice(0, 6).map((request) => (
              <div
                key={request._id}
                className={`border rounded-md p-4 ${
                  request.urgency === "emergency"
                    ? "border-l-4 border-l-red-500"
                    : request.urgency === "urgent"
                    ? "border-l-4 border-l-yellow-500"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        request.urgency === "emergency"
                          ? "bg-red-100 text-red-800"
                          : request.urgency === "urgent"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {request.urgency}
                    </span>
                    <h4 className="font-medium mt-2">
                      {request.requestType === "blood"
                        ? `Blood Type ${request.bloodType} Needed`
                        : `${request.organ} Donation Needed`}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Hospital: {request.hospital.name}
                </p>
                <p className="text-sm text-gray-600">
                  Posted: {formatDate(request.createdAt)}
                </p>
                {request.patientCondition && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Patient:</span>{" "}
                    {request.patientCondition}
                  </p>
                )}
                <div className="mt-3">
                  <Link
                    to={`/donation-request/${request._id}/${request.hospital._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No active donation requests at this time.
          </p>
        )}

        {requests.length > 6 && (
          <div className="mt-4 text-center">
            <Link
              to="/donation-requests"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Requests
            </Link>
          </div>
        )}
      </div>
      <div className="pt-5">
      <Link
        to={`/donation-requests`}
        className="bg-green-600  text-white mx-2 py-3 px-4 capitalize rounded hover:bg-green-700"
      >
        filter donation requets
      </Link>
      </div>
    </div>
  );
};

export default DonorDashboard;
