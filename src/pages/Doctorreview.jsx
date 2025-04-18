import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchSingleDoctor,
  clearDocError,
  clearDocMessage,
} from "../store/actions/doctoraction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import {
  savedDoctorProfile,
  clearUserError,
  clearUserMessage,
} from "../store/actions/useraction";
import {
  ThumbsDown,
  Flag,
  Heart,
  MessageCircle,
  Clock,
  Brain,
  Stethoscope,
  ThumbsUp,
  Share2,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Building2,
  GraduationCap,
  Languages,
  Microscope,
  Pill,
  Bookmark,
} from "lucide-react";

const HASHTAGS = [
  "#KindAndCaring",
  "#GreatListener",
  "#ExplainsClearly",
  "#Knowledgeable",
  "#AccurateDiagnosis",
  "#Professional",
  "#Recommended",
  "#Experienced",
];

function calculateAvgReviews(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      averageData: {
        medicalAccuracy: 0,
        clarityInExplanation: 0,
        communicationSkills: 0,
        punctuality: 0,
        experienceAndExpertise: 0,
      },
      averageRatings: [
        { label: "Medical Accuracy", icon: Stethoscope, rating: 0 },
        { label: "Communication", icon: MessageCircle, rating: 0 },
        { label: "Punctuality", icon: Clock, rating: 0 },
        { label: "Experience", icon: Brain, rating: 0 },
      ],
    };
  }

  const averageData = {
    medicalAccuracy: 0,
    clarityInExplanation: 0,
    communicationSkills: 0,
    punctuality: 0,
    experienceAndExpertise: 0,
  };

  reviews.forEach((review) => {
    averageData.medicalAccuracy += review.medicalAccuracy || 0;
    averageData.clarityInExplanation += review.clarityInExplanation || 0;
    averageData.communicationSkills += review.communicationSkills || 0;
    averageData.punctuality += review.punctuality || 0;
    averageData.experienceAndExpertise += review.experienceAndExpertise || 0;
  });

  const length = reviews.length;
  Object.keys(averageData).forEach((key) => {
    averageData[key] = (averageData[key] / length).toFixed(1);
  });

  return {
    averageData,
    averageRatings: [
      {
        label: "Medical Accuracy",
        icon: Stethoscope,
        rating: averageData.medicalAccuracy,
      },
      {
        label: "Communication",
        icon: MessageCircle,
        rating: averageData.clarityInExplanation,
      },
      { label: "Punctuality", icon: Clock, rating: averageData.punctuality },
      {
        label: "Experience",
        icon: Brain,
        rating: averageData.experienceAndExpertise,
      },
    ],
  };
}

function calculateRatingDistribution(reviews) {
  const distribution = [
    { rating: 1, count: 0 },
    { rating: 2, count: 0 },
    { rating: 3, count: 0 },
    { rating: 4, count: 0 },
    { rating: 5, count: 0 },
  ];

  if (reviews && reviews.length > 0) {
    reviews.forEach((review) => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        distribution[Math.floor(rating) - 1].count++;
      }
    });
  }

  return distribution;
}

function StarRating({ rating, size = 20 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          className={`${
            rating >= index
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function RatingDistribution({ ratings, total }) {
  return (
    <div className="space-y-3">
      {ratings.map(({ rating, count }) => (
        <motion.div
          key={rating}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <span className="w-12 text-sm font-medium">{rating} Star</span>
          <div className="flex-1 h-10 bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-blue-500"
            />
          </div>
          <span className="w-12 text-sm text-right font-medium">{count}</span>
        </motion.div>
      ))}
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div className="bg-white mt-3 rounded-lg shadow-md p-6 w-full">
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">QUALITY</div>
            <div className="w-16 h-16 bg-emerald-200 flex items-center justify-center rounded">
              <span className="text-3xl font-bold">
                {(review.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">EXPERIENCE</div>
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-3xl font-bold">
                {(review.experienceAndExpertise || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
              {(review.hashtags || []).map((tag, index) => {
                return (
                  <span
                    key={index}
                    className="text-md px-3 py-1 rounded-full bg-black/5 font-bold text-gray-900"
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {review.createdAt
                ? format(new Date(review.createdAt), "PPpp")
                : "Date unavailable"}
            </span>
          </div>

          <p className="text-gray-700 bg-gray-50 rounded-md p-3 min-h-[15vh] mb-4">
            {review.comment || "No comment provided"}
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Helpful</span>
              <button className="flex items-center gap-1 hover:text-blue-600">
                <ThumbsUp size={18} />
                <span>{review.helpfulCount || 0}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600">
                <ThumbsDown size={18} />
                <span>{review.unhelpfulCount || 0}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Flag size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Doctorreview() {
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [averageRatings, setAverageRatings] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, doctor, loading } = useSelector((state) => state.Doctor);
  const user = useSelector((state) => state.User);
  const doctorId = useParams().id;

  useEffect(() => {
    dispatch(fetchSingleDoctor(doctorId));
  }, [dispatch, doctorId]);
  useEffect(() => {
    if (user && user.user && user.user.savedDoctors && doctor) {
      // Check if the current doctor ID exists in the user's savedDoctors array
      const isAlreadySaved = user.user.savedDoctors.some(
        (savedDoc) => savedDoc._id === doctor._id || savedDoc === doctor._id
      );
      setIsLiked(isAlreadySaved);
    }
  }, [user, doctor]);
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearDocError());
      navigate("/");
    } else if (user.error) {
      enqueueSnackbar(user.error, { variant: "error" });
      dispatch(clearDocError());
    } else if (user.message) {
      enqueueSnackbar(user.message, { variant: "success" });
      dispatch(clearDocMessage());
    }
  }, [error, user.error, user.message, enqueueSnackbar, dispatch, navigate]);

  useEffect(() => {
    if (doctor && doctor.reviews) {
      const { averageRatings: ratings } = calculateAvgReviews(doctor.reviews);
      setAverageRatings(ratings);
      setRatingDistribution(calculateRatingDistribution(doctor.reviews));
    }
  }, [doctor]);

  const handlesaved = (id) => {
    console.log(id);
    setIsLiked(!isLiked);
    dispatch(savedDoctorProfile(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Loading doctor information...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Doctor information not available</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen inset-0 bg-gradient-to-r  bg-white">
        <div className="max-w-5xl mx-auto p-6">
          {/* Doctor Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-400"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={doctor.image}
                className="w-40 h-40 rounded-xl object-cover object-center shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {doctor.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Stethoscope className="text-blue-500" size={18} />
                      <p className="text-blue-600 font-medium">
                        {Array.isArray(doctor.speciality)
                          ? doctor.speciality
                          : doctor.speciality}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlesaved(doctor._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isLiked
                          ? "bg-gray-50 text-gray-700"
                          : "bg-black/4 text-gray-500"
                      }`}
                    >
                      <Bookmark
                        className={isLiked ? "fill-current" : ""}
                        size={24}
                      />
                    </motion.button>
                  </div>
                </div>

                <div className="flex justify-center flex-col gap-2 mt-4">
                  <span className="text-gray-600 text-xl">
                    <span className="text-4xl font-bold">
                      {doctor.rating ? doctor.rating.toFixed(1) : "0.0"}
                    </span>
                    /5
                    <span className="text-gray-800 text-sm">
                      {" "}
                      Overall Quality Based on{" "}
                      {doctor.reviews ? doctor.reviews.length : 0} ratings
                    </span>
                  </span>
                  <StarRating rating={doctor.rating || 0} />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full md:w-auto px-12 py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                  >
                    <Link to={`/${doctorId}/ratedoctor`}>Write Review</Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full md:w-auto px-12 py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                  >
                    <Link to={`/appointment/${doctorId}`}>
                      Book an Appointment
                    </Link>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-400"
            >
              <h2 className="text-xl font-semibold mb-6">
                Rating Distribution
              </h2>
              <RatingDistribution
                ratings={ratingDistribution}
                total={doctor.reviews ? doctor.reviews.length : 0}
              />
            </motion.div>

            {/* Evaluation Criteria */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-400"
            >
              <h2 className="text-xl font-semibold mb-6">Average Ratings</h2>
              <div className="space-y-4">
                {averageRatings.map((criteria) => (
                  <motion.div
                    key={criteria.label}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer  ${
                      selectedCriteria === criteria.label
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-black/4"
                    }`}
                    onClick={() => setSelectedCriteria(criteria.label)}
                  >
                    <criteria.icon className="text-blue-500" size={24} />
                    <div className="flex-1">
                      <div className="font-medium">{criteria.label}</div>
                      <StarRating rating={criteria.rating} size={16} />
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {criteria.rating}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Certifications & Tags */}
          <div className="grid md:grid-cols-2 gap-6 mt-6 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl mx-auto shadow-lg p-6 border border-gray-400"
            >
              <h2 className="text-xl font-semibold mb-4">Common Tags</h2>
              <div className="flex flex-wrap gap-2">
                {HASHTAGS.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Additional Information Cards */}
          {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock3 className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-lg font-semibold">Within 24hrs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hospital Affiliations</p>
                <p className="text-lg font-semibold">3 Major Hospitals</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Languages className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-lg font-semibold">English, Spanish</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <GraduationCap className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Education</p>
                <p className="text-lg font-semibold">Harvard Medical</p>
              </div>
            </div>
          </motion.div>
        </div> */}

          {/* Specializations */}
          {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
        >
          <h2 className="text-xl font-semibold mb-4">Specializations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Microscope, label: "Clinical Research", count: "50+ Studies" },
              { icon: Brain, label: "Neurological Cases", count: "1000+" },
              { icon: Pill, label: "Treatment Plans", count: "2000+" }
            ].map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <spec.icon className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-medium">{spec.label}</p>
                  <p className="text-sm text-gray-600">{spec.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

          {/* Reviews */}
          <div className="mt-6 p-10 bg-black/4">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {doctor.reviews && doctor.reviews.length > 0 ? (
              doctor.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            ) : (
              <p className="text-gray-500">No reviews available yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Doctorreview;
