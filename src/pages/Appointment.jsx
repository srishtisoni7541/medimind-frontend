import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import RelatedDoctors from '../components/RelatedDoctors';
import { 
  Calendar, 
  Clock, 
  Award, 
  User, 
  Check, 
  ChevronRight, 
  MapPin, 
  Shield, 
  CreditCard, 
  Star,
  ChevronLeft,
  ChevronDown,
  Calendar as CalendarIcon
} from 'lucide-react';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id == docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setLoading(true);
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10);
        currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotAvailable = !(docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime));

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        setDocSlots((prev) => [...prev, timeSlots]);
      }
    }
    setLoading(false);
  };

  const bookAppointment = async () => {
    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }
    
    if (!token) {
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }

    setLoading(true);
    try {
      const date = docSlots[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { utoken: token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);
  
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (!docInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Format doctor's about text to show truncated version
  const aboutText = docInfo.about || "No information available";
  const truncatedAbout = aboutText.length > 150 && !showMoreAbout 
    ? aboutText.substring(0, 150) + '...' 
    : aboutText;

  // Function to format date for display
  const formatDate = (date) => {
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 ">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6 text-gray-500">
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
        <ChevronRight size={16} />
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/doctors')}>Doctors</span>
        <ChevronRight size={16} />
        <span className="text-gray-800">{docInfo.name}</span>
      </div>

      {/* Doctor profile section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Doctor image */}
            <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto md:mx-0">
                <img 
                  className="w-full h-full object-cover" 
                  src={docInfo.image} 
                  alt={docInfo.name} 
                />
              </div>
              {docInfo.available && (
                <div className="absolute -bottom-2 left-1/2 md:left-auto md:bottom-3 md:right-0 transform -translate-x-1/2 md:translate-x-0 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Available
                </div>
              )}
            </div>

            {/* Doctor details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
                    {docInfo.name}
                    <img className="w-5" src={assets.verified_icon} alt="Verified" />
                  </h1>
                  <p className="text-blue-600 font-medium mt-1">{docInfo.speciality}</p>
                  <div className="flex items-center gap-2 mt-2 justify-center md:justify-start text-gray-600 text-sm">
                    <span className="flex items-center">
                      <Award size={16} className="mr-1 text-blue-500" />
                      {docInfo.degree}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="flex items-center">
                      <User size={16} className="mr-1 text-blue-500" />
                      {docInfo.experience}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center justify-center md:justify-end gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        className={`${star <= (docInfo.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">{docInfo.rating || 4.0}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {currencySymbol}{docInfo.fees} <span className="text-sm font-normal text-gray-500">per consultation</span>
                  </div>
                </div>
              </div>

              {docInfo.hospital && (
                <div className="mt-4 flex items-center justify-center md:justify-start text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>{docInfo.hospital}</span>
                </div>
              )}

              {/* About section */}
              <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-4">
                <h2 className="font-medium text-gray-800 flex items-center gap-1 mb-2">
                  About
                  <img src={assets.info_icon} alt="Info" className="w-4 h-4" />
                </h2>
                <p className="text-sm text-gray-600">{truncatedAbout}</p>
                {aboutText.length > 150 && (
                  <button 
                    onClick={() => setShowMoreAbout(!showMoreAbout)}
                    className="text-blue-600 text-sm font-medium mt-1 hover:text-blue-700"
                  >
                    {showMoreAbout ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment booking section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Calendar className="mr-2 text-blue-600" size={20} />
            Select Appointment Date & Time
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : docSlots.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-700">No available slots found for the next 7 days.</p>
              <p className="text-sm text-yellow-600 mt-1">Please try again later or contact the clinic directly.</p>
            </div>
          ) : (
            <>
              {/* Date selection */}
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-3">Select Date</h3>
                <div className="flex gap-3 items-center w-full overflow-x-auto pb-2">
                  {docSlots.map((slots, index) => {
                    const date = slots[0].dateTime;
                    return (
                      <div 
                        key={index}
                        onClick={() => {
                          setSlotIndex(index);
                          setSlotTime('');
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all cursor-pointer min-w-16 ${
                          slotIndex === index 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <span className="text-xs font-semibold mb-1">{daysOfWeek[date.getDay()]}</span>
                        <span className="text-xl font-bold">{date.getDate()}</span>
                        <span className="text-xs mt-1">{monthNames[date.getMonth()]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time selection */}
              <div>
                <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                  <Clock size={16} className="mr-2 text-blue-600" />
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                  {docSlots[slotIndex].map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => setSlotTime(slot.time)}
                      className={`text-center py-2 px-3 rounded-lg transition-all cursor-pointer border ${
                        slot.time === slotTime 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment summary */}
              {slotTime && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Appointment Summary</h3>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{docInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(docSlots[slotIndex][0].dateTime)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{slotTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium">{currencySymbol}{docInfo.fees}</span>
                  </div>
                </div>
              )}

              {/* Book appointment button */}
              <button 
                onClick={bookAppointment}
                disabled={loading || !slotTime}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  !slotTime 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CalendarIcon size={18} />
                    Book Appointment
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          {/* Why Choose section */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Why choose online consultation</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Consultation from the comfort of your home</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">No travel or waiting time</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Private and secure consultation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <CreditCard size={18} className="mr-2 text-blue-600" />
              Payment Information
            </h3>
            <p className="text-sm text-gray-600 mb-3">We accept various payment methods for your convenience.</p>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Security note */}
          <div className="bg-blue-50 rounded-2xl p-5">
            <div className="flex items-start">
              <Shield className="text-blue-600 mr-3 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Secure & Confidential</h3>
                <p className="text-sm text-gray-600">Your personal information and consultation details are protected and kept confidential.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related doctors section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Similar Specialists</h2>
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;