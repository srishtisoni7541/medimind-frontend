import React, { useEffect, useState } from 'react';
import { UserRound, Star, MapPin, Clock, Heart, X, Tag, Phone, Mail, Bookmark, Stethoscope } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearDocError, clearDocMessage, fetchSingleDoctor, } from '../store/actions/doctoraction';
import {savedDoctorProfile,clearUserError,clearUserMessage} from '../store/actions/useraction'
import { motion, AnimatePresence } from 'framer-motion';
// Delete Confirmation Dialog Component
function RemoveConfirmationDialog({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Confirm Remove</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to remove this doctor from your saved list?
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
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

function DoctorCard({ doctor, onRemoveDoctor }) {
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    const handleRemoveClick = () => {
        setShowRemoveConfirm(true);
    };

    const handleConfirmRemove = () => {
        onRemoveDoctor(doctor._id);
        setShowRemoveConfirm(false);
    };

  

    // Render specialty tag
    const renderSpecialty = (specialty) => {
        return (
            <span key={specialty} className="inline-flex items-center bg-blue-100 text-blue-700 text-md font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                <Tag className="w-4 h-4 mr-1" />
                {specialty}
            </span>
        );
    };

    return (
        <>

            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={doctor.image}
                    className="w-40 h-40 rounded-xl object-cover object-center shadow-lg p-2 border-gray-400 border-2"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                {doctor.specialty && doctor.specialty.length > 0 && (
                                    <div className="mb-2 flex flex-wrap">
                                        {doctor.specialty.map(spec => renderSpecialty(spec))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-center flex-col gap-2 mt-4">
                        <span className="text-gray-600 text-xl">
                            <span className='text-4xl font-bold'>{doctor.rating ? doctor.rating.toFixed(1) : "0.0"}</span>/5
                            <span className='text-gray-800 text-sm'> Overall Quality Based on {doctor.reviews ? doctor.reviews.length : 0} ratings</span>
                        </span>
                        <StarRating rating={doctor.rating || 0} />
                    </div>
                    <div className="mt-6 pt-4 border-t flex justify-between">
                        <Link to={`/${doctor._id}/doctorreview`}>
                            <button
                                className="px-5 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
                            >
                                <span>View Profile</span>
                            </button>
                        </Link>
                        <button
                            className="px-5 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
                            onClick={handleRemoveClick}
                        >
                            <Bookmark className="w-4 h-4 fill-gray-600" />
                            <span>Remove from Saved</span>
                        </button>
                    </div>

                    <RemoveConfirmationDialog
                        isOpen={showRemoveConfirm}
                        onClose={() => setShowRemoveConfirm(false)}
                        onConfirm={handleConfirmRemove}
                    />
                </div>

            </div>
        </>
    );
}
function StarRating({ rating, size = 20 }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((index) => (
                <Star
                    key={index}
                    size={size}
                    className={`${rating >= index ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                />
            ))}
        </div>
    );
}
function SavedDoctors() {
    const [savedDoctors, setSavedDoctors] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { user, error, message } = useSelector((state) => state.User);
    const doctor = useSelector((state) => state.Doctor);
    // Handle removing a doctor from saved list
    const handleRemoveDoctor = (doctorId) => {
        dispatch(savedDoctorProfile(doctorId));
    };

    useEffect(() => {
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

        // Set saved doctors from user data
        if (user && user.savedDoctors) {
            setSavedDoctors(user.savedDoctors || []);
        }
    }, [error, message, user, doctor.error, doctor.message, dispatch, enqueueSnackbar]);

    return user && (
       <>
       
                <header className=" w-fit mx-auto fixed left-[50%] max-sm:hidden translate-x-[-50%] top-0 z-[999999999]">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-center ">
                            <button
                                className={`py-4 px-6 focus:outline-none  transition-colors duration-200 ${true === true
                                    ? 'text-gray-500 '
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <UserRound className="w-5 h-5" />
                                    <span>Saved Doctors</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>
        <div className=''>
            <div className="min-h-screen bg-gray-100 pt-[18vh]">

                <main className="max-w-6xl mx-auto px-4 py-8">
                    <div className="space-y-6">
                        {savedDoctors && savedDoctors.length > 0 ? (
                            savedDoctors.map(doctor => (
                                <DoctorCard
                                    key={doctor._id}
                                    doctor={doctor}
                                    onRemoveDoctor={handleRemoveDoctor}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl shadow p-8 text-center">
                                <Heart className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Saved Doctors</h3>
                                <p className="text-gray-600 mb-6">You haven't saved any doctors yet. Save doctors to quickly access their profiles later.</p>
                                <Link to="/">
                                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                                        Find Doctors
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

            </div>
        </div>
       </>
    );
}

export default SavedDoctors;