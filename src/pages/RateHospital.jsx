import React, { useEffect, useState } from 'react';
import { Star, Clock, Building2, Heart, Users, Sparkles, Armchair, Stethoscope, MapPin, Phone, Award, Calendar, Ambulance, HelpCircle } from 'lucide-react';
import { fetchSingleHospital, clearHosError, clearHosMessage, addHospitalReview } from "../store/actions/hospitalaction";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Tooltip = ({ text }) => (
  <div className="group relative">
    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
    <div className="absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-1">
      {text}
    </div>
  </div>
);

const RatingBox = ({ title,  value, onChange, icon, description, tooltipText, error }) => {
  const getBackgroundColor = (rating, currentValue) => {
    if (rating === 1) return currentValue >= 1 ? 'bg-red-500' : 'bg-gray-200';
    if (rating === 2) return currentValue >= 2 ? 'bg-orange-500' : 'bg-gray-200';
    if (rating === 3) return currentValue >= 3 ? 'bg-yellow-500' : 'bg-gray-200';
    if (rating === 4) return currentValue >= 4 ? 'bg-lime-500' : 'bg-gray-200';
    if (rating === 5) return currentValue >= 5 ? 'bg-green-500' : 'bg-gray-200';
  };

  const getRatingText = (value) => {
    if (value === 0) return '';
    if (value === 1) return 'Poor';
    if (value === 2) return 'Fair';
    if (value === 3) return 'Good';
    if (value === 4) return 'Very Good';
    return 'Excellent';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg scale-[1.5] mr-3 text-blue-600">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-800 text-md">{title}</h3>
            </div>
            {tooltipText && <Tooltip text={tooltipText} />}
          </div>
          {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex gap-1 w-full sm:w-[35vh] mt-6 mx-auto">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`h-8 flex-1 cursor-pointer rounded-lg transition-all duration-200 ${getBackgroundColor(rating, value)}`}
            />
          ))}
        </div>
        <div className="flex justify-between w-full sm:w-[35vh] items-center mx-auto">
          <span className="text-xs text-gray-500">1</span>
          <span className="text-sm font-medium text-gray-700">{getRatingText(value)}</span>
          <span className="text-xs text-gray-500">5</span>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

const HospitalInfo = ({ data }) => (
  <div className="bg-white border rounded-xl p-6 shadow-md mb-8 max-w-2xl mx-auto">
    <div className="flex items-start gap-6">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
        <Building2 className="w-12 h-12 text-blue-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
          <Award className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-gray-600 text-sm mb-4">{data.specialties.join(',  ')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">{data.address}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 text-sm">
            <Phone className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">{data.phone}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-700">{data.rating}/5 ({data.reviews.length} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CheckboxToggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4 max-w-2xl mx-auto cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
    />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);

function RateHospital() {
  const [formData, setFormData] = useState({
    ratings: {
      staffFriendliness: 0,
      facilityClean: 0,
      waitingTime: 0,
      accessibility: 0,
      appointmentEase: 0,
      emergencyResponse: 0,
      overall: 0
    },
    comment: '',
    madeAppointment: false,
    usedEmergency: false
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, hospital, message } = useSelector(state => state.Hospital);
  const hospitalId = useParams().id;
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate all required ratings
    Object.entries(formData.ratings).forEach(([key, value]) => {
      // Skip conditional fields if not applicable
      if (key === 'appointmentEase' && !formData.madeAppointment) return;
      if (key === 'emergencyResponse' && !formData.usedEmergency) return;
      
      if (value === 0) {
        newErrors[`ratings.${key}`] = `${key.charAt(0).toUpperCase() + key.slice(1)} rating is required`;
      }
    });

    // Validate comment
    if (formData.comment.length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Prepare data for submission
      const reviewData = {
        ratings: { ...formData.ratings },
        comment: formData.comment
      };
      
      // Send all ratings to the backend, including those with 0 for conditional fields
      dispatch(addHospitalReview(reviewData, hospitalId));
    }
  };

  useEffect(() => {
    dispatch(fetchSingleHospital(hospitalId));
  }, [dispatch, hospitalId]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearHosError());
    }
    if (message) {
      enqueueSnackbar(message, { variant: "success" });
      dispatch(clearHosMessage());
      navigate(`/${hospitalId}/hospitalreview`);
    }
  }, [error, message, dispatch, enqueueSnackbar, navigate, hospitalId]);

  return hospital && (
   <>
   <div className="min-h-screen  bg-white py-8  px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Hospital</h1>
          <p className="text-gray-600">Your feedback helps improve healthcare services</p>
        </div>

        <HospitalInfo data={hospital} />

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          {/* 1. Staff Friendliness */}
          <RatingBox
            title="Staff Friendliness"
            value={formData.ratings.staffFriendliness}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, staffFriendliness: value }
            }))}
            icon={<Users className="w-4 h-4" />}
            tooltipText="How was the attitude and communication of hospital staff (doctors, nurses, reception, etc.)?"
            error={isSubmitted ? errors['ratings.staffFriendliness'] : null}
          />

          {/* 2. Facility Cleanliness */}
          <RatingBox
            title="Facility Cleanliness"
            value={formData.ratings.facilityClean}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, facilityClean: value }
            }))}
            icon={<Sparkles className="w-4 h-4" />}
            tooltipText="Was the hospital environment (restrooms, waiting area, treatment rooms) clean and hygienic? "
            error={isSubmitted ? errors['ratings.facilityClean'] : null}
          />

          {/* 3. Waiting Time */}
          <RatingBox
            title="Waiting Time"
            value={formData.ratings.waitingTime}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, waitingTime: value }
            }))}
            icon={<Clock className="w-4 h-4" />}
            tooltipText="Was the waiting time from check-in to actual treatment reasonable? "
            error={isSubmitted ? errors['ratings.waitingTime'] : null}
          />

          {/* 4. Accessibility */}
          <RatingBox
            title="Accessibility"
            value={formData.ratings.accessibility}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, accessibility: value }
            }))}
            icon={<MapPin className="w-4 h-4" />}
            tooltipText="Was the hospital easy to access via public transportation or car? Was parking convenient? "
            error={isSubmitted ? errors['ratings.accessibility'] : null}
          />

          {/* 5. Appointment Scheduling Ease - Conditional */}
          <CheckboxToggle
            label="Did you make an appointment before visiting? "
            checked={formData.madeAppointment}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              madeAppointment: e.target.checked
            }))}
          />

          {formData.madeAppointment && (
            <RatingBox
              title="Appointment Scheduling Ease"
              value={formData.ratings.appointmentEase}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                ratings: { ...prev.ratings, appointmentEase: value }
              }))}
              icon={<Calendar className="w-4 h-4" />}
              tooltipText="Was the process of booking an appointment smooth and convenient? "
              error={isSubmitted ? errors['ratings.appointmentEase'] : null}
            />
          )}

          {/* 6. Emergency Response Efficiency - Conditional */}
          <CheckboxToggle
            label="Did you use the emergency room?"
            checked={formData.usedEmergency}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              usedEmergency: e.target.checked
            }))}
          />

          {formData.usedEmergency && (
            <RatingBox
              title="Emergency Response Efficiency"
              value={formData.ratings.emergencyResponse}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                ratings: { ...prev.ratings, emergencyResponse: value }
              }))}
              icon={<Ambulance className="w-4 h-4" />}
              tooltipText="If you used the emergency room, was the hospital's response timely and appropriate? / 응급 상황에서 병원의 대응은 신속하고 적절했나요?"
              error={isSubmitted ? errors['ratings.emergencyResponse'] : null}
            />
          )}

          {/* 7. Overall Rating */}
          <RatingBox
            title="Overall Rating"
            value={formData.ratings.overall}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, overall: value }
            }))}
            icon={<Star className="w-4 h-4" />}
            tooltipText="How would you rate your overall experience?"
            error={isSubmitted ? errors['ratings.overall'] : null}
          />

          {/* Comment Section */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="comment" className="block font-medium text-gray-800 mb-1 text-sm">
                  Additional Comments / 추가 의견
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience... "
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    comment: e.target.value
                  }))}
                  maxLength={500}
                />
                {isSubmitted && errors.comment && (
                  <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.comment.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            Submit Review / 리뷰 제출
          </button>
        </form>
      </div>
    </div>
   </>
  );
}

export default RateHospital;