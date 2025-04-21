import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateUserProfileData = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { utoken: token }
      })
      
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEdit(false)
    setImage(null)
    loadUserProfileData() // Reset to original data
  }

  return userData && (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 w-full">
        <div className="container mx-auto px-4 relative h-full">
          <div className="absolute left-8 -bottom-16 flex items-end">
            {isEdit ? (
              <label htmlFor="image" className="group cursor-pointer">
                <div className="relative rounded-full overflow-hidden border-4 border-white shadow-lg h-32 w-32 md:h-40 md:w-40">
                  <img 
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" 
                    src={image ? URL.createObjectURL(image) : userData.image} 
                    alt="Profile" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                    <img className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" src={assets.upload_icon} alt="Upload" />
                  </div>
                </div>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" className="hidden" accept="image/*" />
              </label>
            ) : (
              <div className="rounded-full overflow-hidden border-4 border-white shadow-lg h-32 w-32 md:h-40 md:w-40">
                <img className="w-full h-full object-cover" src={userData.image} alt="Profile" />
              </div>
            )}
            <div className="ml-4 mb-4 text-white hidden md:block">
              {isEdit ? (
                <input 
                  className="text-3xl font-bold bg-transparent border-b-2 border-white focus:outline-none focus:border-gray-200 text-black px-2 py-1 w-full md:w-96" 
                  type="text" 
                  value={userData.name} 
                  onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                />
              ) : (
                <h1 className="text-3xl text-black font-bold">{userData.name}</h1>
              )}
              <p className="text-blue-500">{userData.email}</p>
            </div>
          </div>
          
          <div className="absolute right-8 bottom-6">
            {isEdit ? (
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 bg-blue-500 bg-opacity-25 text-white rounded-md hover:bg-opacity-40 transition-all"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-white text-blue-700 rounded-md hover:bg-gray-100 transition-all flex items-center font-medium"
                  onClick={updateUserProfileData}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button 
                className="px-6 py-2 bg-white text-blue-700 rounded-md hover:bg-gray-100 transition-all flex items-center font-medium"
                onClick={() => setIsEdit(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Name Display (only visible on mobile) */}
      <div className="md:hidden container mx-auto px-6 mt-20 mb-6">
        {isEdit ? (
          <input 
            className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-transparent px-2 py-1 w-full" 
            type="text" 
            value={userData.name} 
            onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
        )}
        <p className="text-gray-600">{userData.email}</p>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-800">{userData.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                {isEdit ? (
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" 
                    value={userData.phone} 
                    onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-800">{userData.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address Details
            </h2>
            <div className="space-y-6">
              {isEdit ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address Line 1</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      type="text" 
                      placeholder="Street address, P.O. box, etc."
                      value={userData.address.line1} 
                      onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address Line 2</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      type="text" 
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      value={userData.address.line2} 
                      onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Address</label>
                  <p className="text-gray-800">{userData.address.line1}</p>
                  {userData.address.line2 && <p className="text-gray-800">{userData.address.line2}</p>}
                </div>
              )}
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                {isEdit ? (
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={userData.gender}
                    onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-gray-800">{userData.gender || 'Not specified'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                {isEdit ? (
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    type="date" 
                    value={userData.dob} 
                    onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                  />
                ) : (
                  <p className="text-gray-800">{userData.dob || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                <p className="text-gray-800">{new Date(userData.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;