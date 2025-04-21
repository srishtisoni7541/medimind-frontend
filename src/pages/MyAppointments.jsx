import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, CreditCard, X, CheckCircle } from 'lucide-react'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  // Helper function to safely parse address
  const parseAddress = (addressData) => {
    if (!addressData) return { line1: '', line2: '' }
    
    try {
      // If addressData is already an object, return it
      if (typeof addressData === 'object') return addressData
      
      // If addressData is a string, try to parse it
      const parsed = JSON.parse(addressData)
      return {
        line1: parsed.line1 || '',
        line2: parsed.line2 || ''
      }
    } catch (error) {
      // If parsing fails, return the string as line1
      return {
        line1: String(addressData),
        line2: ''
      }
    }
  }

  const getUserAppointments = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { utoken: token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { utoken: token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { utoken: token } })
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { utoken: token } })
      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">Cancelled</span>
    }
    if (appointment.isCompleted) {
      return <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">Completed</span>
    }
    if (appointment.payment) {
      return <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">Confirmed</span>
    }
    return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-xs font-medium rounded-full">Pending Payment</span>
  }

  return (
    <div className="max-w-5xl pt-[15vh] mx-auto  px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-lg text-gray-600">You have no appointments yet</p>
          <button 
            onClick={() => navigate('/doctors')}
            className="mt-4 px-6 py-2 bg-[#2C68EC] text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment, index) => {
            // Parse the address properly
            const address = parseAddress(appointment.docData.address);
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md ${
                  appointment.cancelled ? 'border-red-200' : appointment.isCompleted ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={appointment.docData.image} 
                        alt={appointment.docData.name}
                        className="w-28 h-28 object-cover rounded-lg shadow-sm bg-indigo-50" 
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">{appointment.docData.name}</h2>
                          <p className="text-indigo-600 font-medium">{appointment.docData.speciality}</p>
                        </div>
                        <div>{getStatusBadge(appointment)}</div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{slotDateFormat(appointment.slotDate)} | {appointment.slotTime}</span>
                        </div>
                        
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 mt-1" />
                          <div>
                            {address.line1 && <p>{address.line1}</p>}
                            {address.line2 && <p>{address.line2}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {!appointment.isCompleted && !appointment.cancelled && (
                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                      {!appointment.payment ? (
                        <button 
                          onClick={() => appointmentRazorpay(appointment._id)}
                          className="flex items-center px-4 py-2 bg-[#2C68EC] text-white rounded hover:bg-indigo-700 transition duration-300"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Online
                        </button>
                      ) : (
                        <button className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded cursor-default">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Paid
                        </button>
                      )}
                      
                      <button 
                        onClick={() => cancelAppointment(appointment._id)}
                        className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyAppointments