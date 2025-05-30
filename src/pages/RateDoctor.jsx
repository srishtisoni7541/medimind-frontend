import React, { useEffect, useState } from 'react';
import { Star, Clock, Stethoscope, MessageSquare, Brain, Hash, User, MapPin, Phone, Mail, Award, Briefcase } from 'lucide-react';
import { fetchSingleDoctor, clearDocError, clearDocMessage, addDoctorReview } from "../store/actions/doctoraction"
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
const RatingBox = ({ title, titleKo, value, onChange, icon, description, error }) => {
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
    <div className="bg-white  rounded-xl p-4 shadow-md mb-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg scale-[1.5] mr-3 text-blue-600">{icon}</div>
        <div>
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-800 text-md">{title}</h3>
            <h4 className="text-gray-600 text-md">{titleKo}</h4>
          </div>
          {(description) && (
            <div className="text-gray-500 text-xs">
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 ">
        <div className="flex gap-1 w-[35vh] mt-8 mx-auto">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`h-8  flex-1 cursor-pointer rounded-lg transition-all duration-200 ${getBackgroundColor(rating, value)}`}
            />
          ))}
        </div>
        <div className="flex justify-between w-[35vh] items-center mx-auto">
          <span className="text-xs text-gray-500">1</span>
          <span className="text-sm font-medium text-gray-700">{getRatingText(value)}</span>
          <span className="text-xs text-gray-500">5</span>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

const HashtagButton = ({ tag, selected, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selected
      ? 'bg-blue-500 text-white'
      : disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
  >
    <div className="flex flex-col items-center">
      <span>{tag}</span>
    </div>
  </button>
);

const DoctorInfo = ({ doctor }) => (
  <div className="bg-white rounded-xl p-6 shadow-md mb-8 max-w-2xl mx-auto">
    <div className="flex items-start gap-6">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
        <User className="w-12 h-12 text-blue-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
          <Award className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-gray-600 text-sm mb-4">{doctor.speciality} specialist • {doctor.experience} years experience</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">work for {doctor.hospital.name}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-700">{doctor.rating}/5 ({doctor.reviews.length} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function RateDoctor() {
  const [formData, setFormData] = useState({
    ratings: {
      overall: 0,
      medicalAccuracy: 0,
      clarityInExplanation: 0,
      communicationSkills: 0,
      punctuality: 0,
    },
    comments: {
      en: '',
      ko: '',
    },
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, doctor, message } = useSelector(state => state.Doctor)
  const doctorId = useParams().id;
  const hashtags = [
    { en: "#KindAndCaring" },
    { en: "#GreatListener" },
    { en: "#ExplainsClearly" },
    { en: "#Patient" },
    { en: "#Understanding" },
    { en: "#Knowledgeable" },
    { en: "#AccurateDiagnosis" },
    { en: "#RushedAppointments" },
    { en: "#ToughButEffective" },
    { en: "#CouldBeMoreAttentive" },
    { en: "#ConfusingExplanation" },
    { en: "#Late" },
    { en: "#PoorCommunication" }
  ];


  const toggleTag = (tag) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : prev.tags.length >= 4
          ? prev.tags
          : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate ratings
    Object.entries(formData.ratings).forEach(([key, value]) => {
      if (value === 0) {
        newErrors[`ratings.${key}`] = `${key.charAt(0).toUpperCase() + key.slice(1)} rating is required`;
      }
    });

    // Validate comments
    if (formData.comments.en.length < 10) {
      newErrors['comments.en'] = 'English comment must be at least 10 characters';
    }

    // Validate tags
    if (formData.tags.length === 0) {
      newErrors['tags'] = 'Please select at least one tag';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully:', formData);
      dispatch(addDoctorReview(formData, doctorId));
      // Handle successful submission
    }
  };
  useEffect(() => {
    dispatch(fetchSingleDoctor(doctorId));
  }, [dispatch])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearDocError());
    }
    if (message) {
      enqueueSnackbar(message, { variant: "success" });
      dispatch(clearDocMessage());
      navigate(`/${doctorId}/doctorreview`);
    }
  }, [error, message]);
  return doctor && (
   <>
    <div className="min-h-screen pt-[15vh]  bg-gradient-to-r   bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Doctor</h1>
          <p className="text-gray-600">Your feedback helps others make informed decisions</p>
        </div>

        <DoctorInfo doctor={doctor} />

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <RatingBox
            title="Overall Rating"
            value={formData.ratings.overall}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, overall: value }
            }))}
            icon={<Star className="w-4 h-4" />}
            description="How would you rate your overall experience?"
            error={isSubmitted ? errors['ratings.overall'] : null}
          />

          <RatingBox
            title="Medical Accuracy"
            value={formData.ratings.medicalAccuracy}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, medicalAccuracy: value }
            }))}
            icon={<Stethoscope className="w-4 h-4" />}
            error={isSubmitted ? errors['ratings.medicalAccuracy'] : null}
          />

          <RatingBox
            title="Clarity in Explanation"
            value={formData.ratings.clarityInExplanation}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, clarityInExplanation: value }
            }))}
            icon={<MessageSquare className="w-4 h-4" />}
            error={isSubmitted ? errors['ratings.clarityInExplanation'] : null}
          />
          <RatingBox
            title="Experience & Expertise"
            value={formData.ratings.experienceAndExpertise}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, experienceAndExpertise: value }
            }))}
            icon={<Briefcase className="w-4 h-4" />}
            error={isSubmitted ? errors['ratings.experienceAndExpertise'] : null}
          />
          <RatingBox
            title="Communication Skills"
            value={formData.ratings.communicationSkills}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, communicationSkills: value }
            }))}
            icon={<Brain className="w-4 h-4" />}
            error={isSubmitted ? errors['ratings.communicationSkills'] : null}
          />

          <RatingBox
            title="Punctuality"
            value={formData.ratings.punctuality}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, punctuality: value }
            }))}
            icon={<Clock className="w-4 h-4" />}
            error={isSubmitted ? errors['ratings.punctuality'] : null}
          />

          <div className="bg-white rounded-xl p-6 shadow-md mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 text-sm">Add Tags (Select up to 4)</h3>
                <p className="text-xs text-gray-500">{4 - formData.tags.length} tags remaining</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <HashtagButton
                  key={tag.en}
                  tag={tag.en}
                  selected={formData.tags.includes(tag.en)}
                  onClick={() => toggleTag(tag.en)}
                  disabled={!formData.tags.includes(tag.en) && formData.tags.length >= 4}
                />
              ))}
            </div>
            {isSubmitted && errors['tags'] && (
              <p className="text-red-500 text-xs mt-2">{errors['tags']}</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="comment-en" className="block font-medium text-gray-800 mb-1 text-sm">
                  Additional Comments (English)
                </label>
                <textarea
                  id="comment-en"
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience..."
                  value={formData.comments.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    comments: { ...prev.comments, en: e.target.value }
                  }))}
                />
                {isSubmitted && errors['comments.en'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['comments.en']}</p>
                )}
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

export default RateDoctor;