import React, { useEffect, useState } from 'react';
import { 
  Star, MapPin, Phone, Building2, Clock, Users, Armchair, Stethoscope, 
  Heart, Calendar, Award, Sparkles, ThumbsUp, Siren, Flag, HelpCircle, Ambulance
} from 'lucide-react';
import { fetchSingleHospital, clearHosError } from "../store/actions/hospitalaction";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { format } from "date-fns";

// Helper function to calculate average ratings
function calculateAvgReviews(hospital) {
  // Default average data structure
  const averageData = {
    staffFriendliness: 0,
    facilityClean: 0,
    waitingTime: 0,
    accessibility: 0,
    appointmentEase: 0,
    emergencyResponse: 0,
    overall: 0
  };
  
  // Safety check - if no reviews, return zeros
  if (!hospital.reviews || hospital.reviews.length === 0) {
    return averageData;
  }
  
  try {
    let appointmentCount = 0;
    let emergencyCount = 0;
    
    // Count all ratings
    hospital.reviews.forEach((review) => {
      // Handle both direct properties and nested ratings object (for backward compatibility)
      const ratings = review.ratings || review;
      
      // First check if nested property exists, then check direct property as fallback
      // Staff Friendliness - could be staffFriendliness or staffBehavior in old data
      if (ratings.staffFriendliness !== undefined) {
        averageData.staffFriendliness += ratings.staffFriendliness || 0;
      } else if (ratings.staffBehavior !== undefined) {
        averageData.staffFriendliness += ratings.staffBehavior || 0;
      }
      
      // Facility Cleanliness - could be facilityClean or cleanliness in old data
      if (ratings.facilityClean !== undefined) {
        averageData.facilityClean += ratings.facilityClean || 0;
      } else if (ratings.cleanliness !== undefined) {
        averageData.facilityClean += ratings.cleanliness || 0;
      }
      
      // Waiting Time
      if (ratings.waitingTime !== undefined) {
        averageData.waitingTime += ratings.waitingTime || 0;
      }
      
      // Accessibility
      if (ratings.accessibility !== undefined) {
        averageData.accessibility += ratings.accessibility || 0;
      }
      
      // Overall Rating - might be stored as overall or rating
      if (ratings.overall !== undefined) {
        averageData.overall += ratings.overall || 0;
      } else if (ratings.rating !== undefined) {
        averageData.overall += ratings.rating || 0;
      }
      
      // Appointment Ease - only count if exists
      if (ratings.appointmentEase && ratings.appointmentEase > 0) {
        averageData.appointmentEase += ratings.appointmentEase;
        appointmentCount++;
      }
      
      // Emergency Response - only count if exists
      if (ratings.emergencyResponse && ratings.emergencyResponse > 0) {
        averageData.emergencyResponse += ratings.emergencyResponse;
        emergencyCount++;
      }
    });
    
    const length = hospital.reviews.length;
    
    // Calculate average for standard categories if we have reviews
    if (length > 0) {
      averageData.staffFriendliness = averageData.staffFriendliness / length;
      averageData.facilityClean = averageData.facilityClean / length;
      averageData.waitingTime = averageData.waitingTime / length;
      averageData.accessibility = averageData.accessibility / length;
      averageData.overall = averageData.overall / length;
      
      // Calculate average for conditional categories
      averageData.appointmentEase = appointmentCount > 0 ? 
        averageData.appointmentEase / appointmentCount : 0;
      averageData.emergencyResponse = emergencyCount > 0 ? 
        averageData.emergencyResponse / emergencyCount : 0;
    }
    
    return averageData;
  } catch (error) {
    console.error("Error calculating average reviews:", error);
    return averageData; // Return defaults on error
  }
}

// Tooltip component for explanations
const Tooltip = ({ text }) => (
  <div className="group relative inline-block">
    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
    <div className="absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-1">
      {text}
    </div>
  </div>
);

// Renders a rating card with icon and value
function RatingCard({ icon: Icon, label, labelKo, value, color, bgColor, tooltipText }) {
  // Safety check - ensure value is a number
  const ratingValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{label}</span>
            {tooltipText && <Tooltip text={tooltipText} />}
          </div>
          {labelKo && <span className="text-sm text-gray-600">{labelKo}</span>}
          <div className="flex items-center mt-1">
            <span className="text-xl font-bold mr-2">{ratingValue.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= ratingValue
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-black/25'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Renders bar-style rating indicators in reviews
function RatingBlocks({ label, value, color = "bg-green-400" }) {
  // Safety check - ensure value is a number
  const ratingValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((block) => (
          <div
            key={block}
            className={`h-5 w-8 rounded-sm ${block <= ratingValue
              ? color
              : 'bg-[#c8c5c5]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Component to display individual user reviews
function UserReviewCard({ review }) {
  // Safety check - handle both new and old data structures
  const ratings = review.ratings || review;
  
  // Helper functions to safely get rating values
  const getRating = (fieldName, alternateFieldName) => {
    // Check primary field name
    if (ratings && ratings[fieldName] !== undefined) {
      return ratings[fieldName];
    }
    // Check alternate field name if provided
    if (alternateFieldName && ratings && ratings[alternateFieldName] !== undefined) {
      return ratings[alternateFieldName];
    }
    return 0;
  };
  
  const getRatingColor = (value) => {
    if (!value) return "bg-gray-300";
    if (value < 3) return "bg-red-400";
    if (value === 3) return "bg-yellow-400";
    if (value === 4) return "bg-lime-400";
    return "bg-green-500";
  };

  // Get overall rating - could be stored as 'overall' or 'rating'
  const overallRating = getRating('overall', 'rating');
  
  // Get a display-friendly date
  let reviewDate = "N/A";
  try {
    if (review.createdAt) {
      reviewDate = format(new Date(review.createdAt), "PPpp");
    }
  } catch (error) {
    console.error("Error formatting date:", error);
  }

  return (
    <div className="bg-gray-200 rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <span className="text-sm text-gray-500"><span className="text-black font-medium">Created At</span> : {reviewDate}</span>
        <div className="flex flex-col items-center">
          <span className="font-medium">Overall</span>
          <div className="bg-yellow-200 px-3 py-1 sm:px-4 sm:py-2 rounded">
            <span className="text-lg sm:text-2xl font-bold">
              {typeof overallRating === 'number' ? overallRating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="text-gray-900 mb-6 text-sm sm:text-base p-3 bg-gray-50 rounded-lg">
        {review.comment || "No comment provided."}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {/* Handle old data structure (staffBehavior) or new (staffFriendliness) */}
        <RatingBlocks 
          label="Staff Friendliness" 
          value={getRating('staffFriendliness', 'staffBehavior')}
          color={getRatingColor(getRating('staffFriendliness', 'staffBehavior'))} 
        />
        
        {/* Handle old data structure (cleanliness) or new (facilityClean) */}
        <RatingBlocks 
          label="Facility Cleanliness" 
          value={getRating('facilityClean', 'cleanliness')}
          color={getRatingColor(getRating('facilityClean', 'cleanliness'))} 
        />
        
        <RatingBlocks 
          label="Waiting Time" 
          value={getRating('waitingTime')}
          color={getRatingColor(getRating('waitingTime'))} 
        />
        
        <RatingBlocks 
          label="Accessibility" 
          value={getRating('accessibility')}
          color={getRatingColor(getRating('accessibility'))}
        />
        
        {/* Only show appointment ease if it exists and is > 0 */}
        {getRating('appointmentEase') > 0 && (
          <RatingBlocks 
            label="Appointment Ease" 
            value={getRating('appointmentEase')} 
            color={getRatingColor(getRating('appointmentEase'))} 
          />
        )}
        
        {/* Only show emergency response if it exists and is > 0 */}
        {getRating('emergencyResponse') > 0 && (
          <RatingBlocks 
            label="Emergency Response" 
            value={getRating('emergencyResponse')} 
            color={getRatingColor(getRating('emergencyResponse'))} 
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span className="font-medium">Helpful</span>
        <button className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" /> 
        </button>
        <button className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4 rotate-180" /> 
        </button>
        <button className="ml-auto">
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Main component
function HospitalReview() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, hospital } = useSelector(state => state.Hospital);
  const hospitalId = useParams().id;
  
  // Calculate averages when hospital data is available
  // Wrap in try/catch to prevent rendering errors
  let averageRatings = {};
  try {
    if (hospital) {
      averageRatings = calculateAvgReviews(hospital);
    }
  } catch (error) {
    console.error("Error calculating ratings:", error);
    averageRatings = {};
  }
  
  // Create rating cards with calculated averages and bilingual labels
  const ratingCards = hospital ? [
    { 
      icon: Users, 
      label: "Staff Friendliness", 
      
      value: averageRatings.staffFriendliness || 0, 
      color: "text-indigo-500", 
      bgColor: "bg-indigo-100",
      tooltipText: "Rating of how friendly and helpful the hospital staff was"
    },
    { 
      icon: Sparkles, 
      label: "Facility Cleanliness", 
       
      value: averageRatings.facilityClean || 0, 
      color: "text-green-500", 
      bgColor: "bg-green-100",
      tooltipText: "Rating of how clean the hospital facilities were"
    },
    { 
      icon: Clock, 
      label: "Waiting Time", 
      
      value: averageRatings.waitingTime || 0, 
      color: "text-amber-500", 
      bgColor: "bg-amber-100",
      tooltipText: "Rating of how reasonable the waiting time was"
    },
    { 
      icon: Armchair, 
      label: "Accessibility", 
      
      value: averageRatings.accessibility || 0, 
      color: "text-teal-500", 
      bgColor: "bg-teal-100",
      tooltipText: "Rating of how easy it was to access the hospital"
    },
    ...(averageRatings.appointmentEase > 0 ? [{
      icon: Calendar, 
      label: "Appointment Ease", 
       
      value: averageRatings.appointmentEase, 
      color: "text-blue-500", 
      bgColor: "bg-blue-100",
      tooltipText: "Rating of how easy it was to make an appointment"
    }] : []),
    ...(averageRatings.emergencyResponse > 0 ? [{
      icon: Ambulance, 
      label: "Emergency Response", 
       
      value: averageRatings.emergencyResponse, 
      color: "text-red-500", 
      bgColor: "bg-red-100",
      tooltipText: "Rating of how well the hospital handled emergency situations"
    }] : []),
    { 
      icon: Star, 
      label: "Overall Rating", 
      
      value: averageRatings.overall || 0, 
      color: "text-yellow-500", 
      bgColor: "bg-yellow-100",
      tooltipText: "Average overall rating given by users"
    }
  ] : [];

  useEffect(() => {
    dispatch(fetchSingleHospital(hospitalId));
  }, [dispatch, hospitalId]);

  useEffect(() => {
    if(error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearHosError());
      navigate('/');
    }
  }, [error, dispatch, enqueueSnackbar, navigate]);

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Loading hospital information...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen  bg-gradient-to-r  bg-white ">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hospital Information Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-400">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <div className="w-32 h-32 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-16 h-16 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-2">{hospital.name}</h1>
              <h2 className="text-gray-900 text-lg">Specialties:</h2>
              <div className="text-gray-600 text-sm mb-4 flex flex-wrap gap-2">
                {Array.isArray(hospital.specialties) ? hospital.specialties.map((specialty, index) => (
                  <span key={index} className="bg-blue-50 px-3 py-1 rounded-full">
                    {specialty}
                  </span>
                )) : <span>No specialties listed</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 bg-black/4 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{hospital.address || "Address not available"}</span>
                </div>
                <div className="flex items-center space-x-2 bg-black/4 p-3 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{hospital.phone ? `+91 ${hospital.phone}` : "Phone not available"}</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="bg-black/4 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">
                  {typeof hospital.rating === 'number' ? hospital.rating.toFixed(1) : "N/A"}
                </div>
                <div className="flex justify-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${star <= (hospital.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-black/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {hospital.reviews && Array.isArray(hospital.reviews) ? hospital.reviews.length : 0} 
                  review{(!hospital.reviews || !hospital.reviews.length || hospital.reviews.length !== 1) ? 's' : ''}
                </span>
              </div>
              <Link 
                to={`/${hospital._id}/ratehospital`} 
                className="mt-4 w-full justify-center flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </Link>
            </div>
          </div>

          {/* Detailed Ratings Section */}
          <div>
            <h2 className="text-xl font-bold mb-6">Detailed Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ratingCards.map((card, index) => (
                <RatingCard key={index} {...card} />
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4 w-[90%] lg:w-[80%] mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {hospital.reviews && Array.isArray(hospital.reviews) ? hospital.reviews.length : 0} 
              review{(!hospital.reviews || !hospital.reviews.length || hospital.reviews.length !== 1) ? 's' : ''}
            </h2>
            <Link 
              to={`/${hospital._id}/ratehospital`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Your Review
            </Link>
          </div>

          {/* If no reviews, show a message */}
          {(!hospital.reviews || !Array.isArray(hospital.reviews) || hospital.reviews.length === 0) && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your experience at this hospital.</p>
              <Link 
                to={`/${hospital._id}/ratehospital`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Write a Review
              </Link>
            </div>
          )}

          {/* Review cards */}
          <div className="space-y-4">
            {hospital.reviews && Array.isArray(hospital.reviews) && hospital.reviews.map((review) => (
              <UserReviewCard key={review._id || `review-${Math.random()}`} review={review} />
            ))}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}

export default HospitalReview;