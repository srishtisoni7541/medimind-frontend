import React, { useEffect, useState } from 'react';
import { Star, UserRound, Building, Clock, MessageCircle, Trash2, Pencil, MapPin, X, Tag } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { clearHosError, clearHosMessage, deleteHospitalReview } from '../store/actions/hospitalaction';
import { clearDocError, clearDocMessage, deleteDoctorReview } from '../store/actions/doctoraction';

// Delete Confirmation Dialog Component
function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, type }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this {type} review? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorReviewCard({ review, onDeleteReview }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteReview('doctor', review._id);
    setShowDeleteConfirm(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-200'
        }`}
      />
    ));
  };

  // Render hashtag with appropriate color based on sentiment
  const renderHashtag = (tag) => {
    const positiveHashtags = ["#KindAndCaring", "#GreatListener", "#ExplainsClearly", "#ToughButEffective", "#Patient", "#Understanding", "#Knowledgeable", "#AccurateDiagnosis"];
    const negativeHashtags = ["#RushedAppointments", "#CouldBeMoreAttentive", "#ConfusingExplanation", "#Late", "#PoorCommunication"];
    
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-700";
    
    if (positiveHashtags.includes(tag)) {
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
    } else if (negativeHashtags.includes(tag)) {
      bgColor = "bg-amber-100";
      textColor = "text-amber-700";
    }
    
    return (
      <span key={tag} className={`inline-flex items-center ${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2`}>
        <Tag className="w-3 h-3 mr-1" />
        {tag}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserRound className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{review.doctor?.name || ''}</h3>
              <p className="text-blue-600 font-medium text-sm mt-1">{review.doctor?.speciality || ''}</p>
            
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Clock className="w-4 h-4" />
                <span>{review.createdAt ? format(new Date(review.createdAt), "PPpp") : "Date unavailable"}</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm">
            <span className="font-bold text-white text-lg">{review.rating ? review.rating.toFixed(1) : ''}</span>
          </div>
        </div>

        {/* Hashtags Section */}
        {review.hashtags && review.hashtags.length > 0 && (
          <div className="mb-6 flex flex-wrap">
            {review.hashtags.map(tag => renderHashtag(tag))}
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <MessageCircle className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-gray-700">{review.comment || ''}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Medical Accuracy', value: review.medicalAccuracy || 0 },
            { label: 'Clarity in Explanation', value: review.clarityInExplanation || 0 },
            { label: 'Communication Skills', value: review.communicationSkills || 0 },
            { label: 'Punctuality', value: review.punctuality || 0 },
            { label: 'Experience & Expertise', value: review.experienceAndExpertise || 0 },
          ].map((rating, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-gray-700 font-medium mb-2 md:mb-0">{rating.label}</span>
                <div className="flex gap-1">
                  {renderStars(rating.value)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end gap-3">
          <Link to={`/edit-doctorrating/${review.doctor?._id}/${review._id}`}>
            <button 
              className="px-5 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </Link>
          <button 
            className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        type="doctor"
      />
    </>
  );
}

function HospitalReviewCard({ review, onDeleteReview }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    onDeleteReview('hospital', review._id);
    setShowDeleteConfirm(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
        }`}
      />
    ));
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{review.hospital.name || ''}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <MapPin className="w-4 h-4" />
                <span>{review.hospital.address || ''}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Clock className="w-4 h-4" />
                <span>{review.createdAt ? format(new Date(review.createdAt), "PPpp") : "Date unavailable"}</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm">
            <span className="font-bold text-white text-lg">{review.overall?.toFixed(1) || review.rating?.toFixed(1) || ''}</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 mb-6">
          <MessageCircle className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-gray-700">{review.comment || ''}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Staff Friendliness', value: review.staffFriendliness },
            { label: 'Facility Cleanliness', value: review.facilityClean },
            { label: 'Waiting Time', value: review.waitingTime },
            { label: 'Accessibility', value: review.accessibility },
            { label: 'Appointment Ease', value: review.appointmentEase },
            { label: 'Emergency Response', value: review.emergencyResponse },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl">
              <div className="space-y-2">
                <span className="text-gray-700 font-medium block">{item.label}</span>
                <div className="flex gap-1">
                  {renderStars(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end gap-3">
          <Link to={`/edit-hospitalrating/${review.hospital._id}/${review._id}`}>
            <button 
              className="px-5 py-2.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </Link>
          <button 
            className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        type="hospital"
      />
    </>
  );
}


function Myratings() {
  const [activeTab, setActiveTab] = useState('doctor');
  const [hospitalReviews, setHospitalReviews] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, message } = useSelector((state) => state.User);
  const hospital = useSelector((state) => state.Hospital);
  const doctor = useSelector((state) => state.Doctor);

  // Global delete handler function
  const handleDeleteReview = (type, id) => {
    if (type === 'hospital') {
      dispatch(deleteHospitalReview(id, navigate));
    } else if (type === 'doctor') {
      dispatch(deleteDoctorReview(id, navigate));
    }
  };

  useEffect(() => {
    // Handle hospital-related notifications
    if (hospital.error) {
      enqueueSnackbar(hospital.error, { variant: 'error' });
      dispatch(clearHosError());
    }
    if (hospital.message) {
      enqueueSnackbar(hospital.message, { variant: 'success' });
      dispatch(clearHosMessage());
    }

    // Handle doctor-related notifications
    if (doctor.error) {
      enqueueSnackbar(doctor.error, { variant: 'error' });
      dispatch(clearDocError());
    }
    if (doctor.message) {
      enqueueSnackbar(doctor.message, { variant: 'success' });
      dispatch(clearDocMessage());
    }

    // Handle user-related errors
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
    if (message) {
      enqueueSnackbar(message, { variant: 'success' });
    }

    // Set reviews from user data
    if (user) {
      setHospitalReviews(user.hosreviews || []);
      setDoctorReviews(user.docreviews || []);
    }
  }, [error, message, user, hospital.error, hospital.message, doctor.error, doctor.message, dispatch, enqueueSnackbar]);

  return user && (
    <>
    <div className='bg-gray-100 pt-[15vh] md:px-[10vh] '>
      <div className="min-h-screen overflow-hidden bg-gray-100 relative pt-[18vh] border-gray-400 rounded-lg border">
        <nav className="bg-white w-full shadow-sm absolute left-[50%] translate-x-[-50%]  top-0 z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => setActiveTab('doctor')}
                className={`py-4 px-6 focus:outline-none transition-colors duration-200 ${
                  activeTab === 'doctor'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserRound className="w-5 h-5" />
                  <span>Doctor Reviews</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('hospital')}
                className={`py-4 px-6 focus:outline-none transition-colors duration-200 ${
                  activeTab === 'hospital'
                    ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <span>Hospital Reviews</span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {activeTab === 'doctor' ? (
              doctorReviews && doctorReviews.length > 0 ? (
                doctorReviews.map(review => (
                  <DoctorReviewCard 
                    key={review._id} 
                    review={review} 
                    onDeleteReview={handleDeleteReview} 
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <UserRound className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Doctor Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't reviewed any doctors yet. Your reviews help others make informed decisions.</p>
                  <Link to="/">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      Find Doctors to Review
                    </button>
                  </Link>
                </div>
              )
            ) : (
              hospitalReviews && hospitalReviews.length > 0 ? (
                hospitalReviews.map(review => (
                  <HospitalReviewCard 
                    key={review._id} 
                    review={review} 
                    onDeleteReview={handleDeleteReview} 
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <Building className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Hospital Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't reviewed any hospitals yet. Your experiences can help improve healthcare.</p>
                  <Link to="/">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                      Find Hospitals to Review
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

export default Myratings;