import React, { useEffect, useState } from 'react';
import { Star, Clock, Stethoscope, MessageSquare, Brain, Hash, User, MapPin, Award, Briefcase } from 'lucide-react';
import { fetchSingleDoctor, clearDocError, clearDocMessage, updateDoctorReview } from "../../store/actions/doctoraction";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const RatingBox = ({ title, titleKo, value, onChange, icon, description, descriptionKo, error }) => {
  const getBackgroundColor = (rating, currentValue) => {
    if (rating === 1) return currentValue >= 1 ? 'bg-red-500' : 'bg-gray-200';
    if (rating === 2) return currentValue >= 2 ? 'bg-orange-500' : 'bg-gray-200';
    if (rating === 3) return currentValue >= 3 ? 'bg-yellow-500' : 'bg-gray-200';
    if (rating === 4) return currentValue >= 4 ? 'bg-lime-500' : 'bg-gray-200';
    if (rating === 5) return currentValue >= 5 ? 'bg-green-500' : 'bg-gray-200';
  };

  const getRatingText = (value) => {
    if (value === 0) return '';
    if (value === 1) return 'Poor / 나쁨';
    if (value === 2) return 'Fair / 부족';
    if (value === 3) return 'Good / 보통';
    if (value === 4) return 'Very Good / 좋음';
    return 'Excellent / 훌륭함';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg scale-[1.5] mr-3 text-blue-600">{icon}</div>
        <div>
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-800 text-md">{title}</h3>
            <h4 className="text-gray-600 text-md">{titleKo}</h4>
          </div>
          {(description || descriptionKo) && (
            <div className="text-gray-500 text-xs">
              <p>{description}</p>
              <p>{descriptionKo}</p>
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
              className={`h-8 flex-1 cursor-pointer rounded-lg transition-all duration-200 ${getBackgroundColor(rating, value)}`}
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

const HashtagButton = ({ tag, tagKo, selected, onClick, disabled }) => (
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
      <span className="text-[10px]">{tagKo}</span>
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
            <span className="text-gray-700">work for {doctor.hospital.name}, {doctor.country}</span>
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

function EditdocRating() {
  const [formData, setFormData] = useState({
    ratings: {
      overall: 0,
      medicalAccuracy: 0,
      clarityInExplanation: 0,
      communicationSkills: 0,
      experienceAndExpertise: 0,
      punctuality: 0,
    },
    comment: '',
    tags: [],
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, doctor, message } = useSelector(state => state.Doctor);
  const { user } = useSelector(state => state.User);
  
  const doctorId = useParams().id;
  const reviewId = useParams().reviewId;
  
  const hashtags = [
    { en: "#KindAndCaring", ko: "#친절함" },
    { en: "#GreatListener", ko: "#경청" },
    { en: "#ExplainsClearly", ko: "#명확한설명" },
    { en: "#Patient", ko: "#인내심" },
    { en: "#Understanding", ko: "#이해심" },
    { en: "#Knowledgeable", ko: "#전문성" },
    { en: "#AccurateDiagnosis", ko: "#정확한진단" },
    { en: "#RushedAppointments", ko: "#빠른진료" },
    { en: "#ToughButEffective", ko: "#까다롭지만효과적" },
    { en: "#CouldBeMoreAttentive", ko: "#더집중필요" },
    { en: "#ConfusingExplanation", ko: "#혼란스러운설명" },
    { en: "#Late", ko: "#지각" },
    { en: "#PoorCommunication", ko: "#소통부족" }
  ];

  // Find the review to edit from user's reviews
  useEffect(() => {
    if (user && user.docreviews && reviewId) {
      const reviewToEdit = user.docreviews.find(review => review._id === reviewId);
      console.log("Review to edit:", reviewToEdit);
      
      if (reviewToEdit) {
        setFormData({
          ratings: {
            overall: reviewToEdit.rating || 0,
            medicalAccuracy: reviewToEdit.medicalAccuracy || 0,
            clarityInExplanation: reviewToEdit.clarityInExplanation || 0,
            communicationSkills: reviewToEdit.communicationSkills || 0,
            experienceAndExpertise: reviewToEdit.experienceAndExpertise || 0,
            punctuality: reviewToEdit.punctuality || 0,
          },
          // Handle both potential formats for comments
          comment: reviewToEdit.comment || 
                  (reviewToEdit.comments && reviewToEdit.comments.en) || 
                  '',
          // Map hashtags correctly from the database
          tags: reviewToEdit.hashtags || reviewToEdit.tags || [],
        });
      } else {
        enqueueSnackbar("Review not found", { variant: "error" });
        navigate(`/${doctorId}/doctorreview`);
      }
      setIsLoading(false);
    }
  }, [user, reviewId]);

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
    if (formData.comment.length < 10) {
      newErrors['comment'] = 'Comment must be at least 10 characters';
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
      // Format the data according to what the backend expects
      const reviewData = {
        ratings: formData.ratings,
        comment: formData.comment,
        hashtags: formData.tags  // Make sure this matches your schema field name
      };
      
      console.log('Form submitted for update:', reviewData);
      dispatch(updateDoctorReview(reviewData, reviewId, navigate));
    }
  };

  useEffect(() => {
    dispatch(fetchSingleDoctor(doctorId));
  }, [dispatch, doctorId]);

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
  }, [error, message, dispatch, enqueueSnackbar, navigate, doctorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading review data...</p>
      </div>
    );
  }

  return doctor && (
   <>
   <div className="min-h-screen bg-gradient-to-r  bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Your Doctor Rating</h1>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">의사 평가 수정하기</h2>
          <p className="text-gray-600">Edit your feedback to improve healthcare services</p>
          <p className="text-gray-600">의료 서비스 개선을 위해 피드백을 수정하세요</p>
        </div>

        <DoctorInfo doctor={doctor} />

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <RatingBox
            title="Overall Rating"
            titleKo="전체 평가"
            value={formData.ratings.overall}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              ratings: { ...prev.ratings, overall: value }
            }))}
            icon={<Star className="w-4 h-4" />}
            description="How would you rate your overall experience?"
            descriptionKo="전반적인 경험은 어떠셨나요?"
            error={isSubmitted ? errors['ratings.overall'] : null}
          />

          <RatingBox
            title="Medical Accuracy"
            titleKo="의료 정확성"
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
            titleKo="설명의 명확성"
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
            titleKo="경험 및 전문성"
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
            titleKo="의사소통 능력"
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
            titleKo="시간 엄수"
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
                <h4 className="font-medium text-gray-600 text-xs">태그 추가 (최대 4개)</h4>
                <p className="text-xs text-gray-500">{4 - formData.tags.length} tags remaining</p>
                <p className="text-xs text-gray-500">{4 - formData.tags.length}개 선택 가능</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <HashtagButton
                  key={tag.en}
                  tag={tag.en}
                  tagKo={tag.ko}
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
            <div>
              <label htmlFor="comment" className="block font-medium text-gray-800 mb-1 text-sm">
                Your Comments / 의견 작성
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience with this doctor..."
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  comment: e.target.value
                }))}
                maxLength={500}
              />
              {isSubmitted && errors['comment'] && (
                <p className="text-red-500 text-xs mt-1">{errors['comment']}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.comment.length}/500 characters
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/${doctorId}/doctorreview`)}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors"
            >
              Cancel / 취소
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
            >
              Update Review / 리뷰 수정
            </button>
          </div>
        </form>
      </div>
    </div>
   </>
  );
}

export default EditdocRating;