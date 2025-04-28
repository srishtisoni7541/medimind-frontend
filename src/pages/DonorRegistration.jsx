import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DonorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodType: '',
    organDonor: false,
    organs: [],
    medicalConditions: [],
    medications: [],
    location: {
      coordinates: [0, 0] // Default coordinates
    }
  });

  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState('');
  const [medication, setMedication] = useState('');

  useEffect(() => {
    // Get user's location if they permit
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.warning("Could not access your location. Please allow location access for better matching.");
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'organDonor') {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle organ checkboxes
        const updatedOrgans = [...formData.organs];
        if (checked) {
          updatedOrgans.push(value);
        } else {
          const index = updatedOrgans.indexOf(value);
          if (index > -1) {
            updatedOrgans.splice(index, 1);
          }
        }
        setFormData({ ...formData, organs: updatedOrgans });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCondition = () => {
    if (condition.trim()) {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, condition.trim()]
      });
      setCondition('');
    }
  };

  const removeCondition = (index) => {
    const updatedConditions = [...formData.medicalConditions];
    updatedConditions.splice(index, 1);
    setFormData({ ...formData, medicalConditions: updatedConditions });
  };

  const addMedication = () => {
    if (medication.trim()) {
      setFormData({
        ...formData,
        medications: [...formData.medications, medication.trim()]
      });
      setMedication('');
    }
  };

  const removeMedication = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData({ ...formData, medications: updatedMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('utoken');
      if (!token) {
        toast.error('You must be logged in to register as a donor');
        navigate('/login');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/donations/donors/register`,
        formData,
        {
          headers: { utoken: token }
        }
      );

      toast.success('Successfully registered as a donor!');
      navigate('/donor-dashboard');
    } catch (error) {
      console.error('Error registering donor:', error);
      toast.error(error.response?.data?.message || 'Failed to register as a donor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mt-[15vh] mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register as a Blood or Organ Donor</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Blood Type Selection */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Blood Type <span className="text-red-500">*</span></label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your blood type</option>
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

        {/* Organ Donor Option */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="organDonor"
              name="organDonor"
              checked={formData.organDonor}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="organDonor" className="ml-2 font-medium">
              I would like to be an organ donor
            </label>
          </div>
        </div>

        {/* Organ Selection (conditional) */}
        {formData.organDonor && (
          <div className="mb-6 pl-6 border-l-2 border-blue-200">
            <label className="block mb-2 font-medium">Select organs you're willing to donate:</label>
            <div className="grid grid-cols-2 gap-2">
              {['kidney', 'liver', 'heart', 'lungs', 'pancreas', 'corneas', 'tissue', 'bone marrow'].map((organ) => (
                <div key={organ} className="flex items-center">
                  <input
                    type="checkbox"
                    id={organ}
                    name={organ}
                    value={organ}
                    checked={formData.organs.includes(organ)}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={organ} className="ml-2 capitalize">
                    {organ}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Conditions */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Medical Conditions</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Enter any medical conditions"
              className="flex-grow p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCondition}
              className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.medicalConditions.map((cond, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span>{cond}</span>
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Current Medications</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              placeholder="Enter any medications you're taking"
              className="flex-grow p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addMedication}
              className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.medications.map((med, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span>{med}</span>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Registering...' : 'Register as Donor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonorRegistration;