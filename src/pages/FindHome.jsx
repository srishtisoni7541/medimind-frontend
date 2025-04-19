import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Search, Stethoscope, MapPin } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { searchHospitals, clearHosError, clearHospitals } from '../store/actions/hospitalaction'
import { searchDoctors, clearDoctors } from '../store/actions/doctoraction'
import { FaStethoscope } from "react-icons/fa";

const FinHome = () => {
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hospitals, error } = useSelector((state) => state.Hospital);
    const { doctors } = useSelector((state) => state.Doctor);
    const doctorError = useSelector((state) => state.Doctor.error);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showResults, setShowResults] = useState(false);
    const [showDocResults, setShowDocResults] = useState(false);
    const [isDoctorSearch, setIsDoctorSearch] = useState(false);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setResults([]);
            setShowResults(false);
            setShowDocResults(false);
            dispatch(clearHospitals());
            dispatch(clearDoctors());
            return;
        }

        dispatch(clearHospitals());
        dispatch(clearDoctors());

        if (isDoctorSearch) {
            dispatch(searchDoctors({ name: searchTerm }));
        } else {
            dispatch(searchHospitals({ name: searchTerm }));
        }
    }, [searchTerm, isDoctorSearch, dispatch])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearHosError());
        } else if (doctorError) {
            enqueueSnackbar(doctorError, { variant: "error" });
        }
    }, [error, doctorError])

    useEffect(() => {
        if (isDoctorSearch) {
            if (doctors.length > 0) {
                setResults(doctors);
                setShowDocResults(true);
                setShowResults(false);
            } else {
                setResults([]);
                setShowDocResults(false);
                setShowResults(false);
            }
        } else {
            if (hospitals && hospitals.length > 0) {
                setResults(hospitals);
                setShowResults(true);
                setShowDocResults(false);
            } else {
                setResults([]);
                setShowResults(false);
                setShowDocResults(false);
            }
        }
    }, [hospitals, doctors, isDoctorSearch]);

    const handleKeyDown = (e) => {
        if (!showResults && !showDocResults) {
            if (e.key === "Enter") {
                if(isDoctorSearch){
                    navigate(`/search?doctorName=${searchTerm}`); 
                }else{
                    navigate(`/search?hospitalName=${searchTerm}`);
                }
            }
            return;
        }
    
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case "Enter":
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    const selectedItem = results[selectedIndex];
                    if (selectedItem && selectedItem._id) {
                        if (isDoctorSearch) {
                            navigate(`/${selectedItem._id}/doctorreview`);
                        } else {
                            navigate(`/${selectedItem._id}/hospitalreview`);
                        }
                        setShowResults(false);
                        setShowDocResults(false);
                    }
                } else {
                    if(isDoctorSearch){
                        navigate(`/search?doctorName=${searchTerm}`); 
                    }else{
                        navigate(`/search?hospitalName=${searchTerm}`);
                    }
                }
                break;
            case "Escape":
                setShowResults(false);
                setShowDocResults(false);
                break;
            default:
                break;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <section
                className="relative flex flex-col items-center justify-center h-screen text-center bg-cover bg-center px-4 font-sans"
                style={
                    {backgroundImage:"url('https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",backgroundSize:"cover",backgroundPosition:"center"}
                }
            >
                {/* Gradient overlay for better text visibility */}
                <div  className="absolute inset-0 bg-black/25"></div>

                {/* Content */}
                <div className="z-10 text-white max-w-4xl mx-auto">
                    {/* Logo and branding */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-white p-2 rounded-full">
                            <FaStethoscope className="text-blue-600 text-3xl" />
                        </div>
                        <h1 className="text-5xl font-bold ml-3 tracking-tight">MediMind</h1>
                    </div>
                    
                    <p className="mt-4 text-xl md:text-2xl font-light">
                        Create your personalized healthcare map with your experiences
                    </p>
                    
                    {/* Search component */}
                    <div className="w-full max-w-2xl mx-auto mt-10 relative">
                        <div className="bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/30 shadow-xl">
                            {/* Search type toggle */}
                            <div className="flex mb-4 rounded-md overflow-hidden">
                                <button 
                                    onClick={() => setIsDoctorSearch(false)}
                                    className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${!isDoctorSearch ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                >
                                    <Building2 size={18} />
                                    <span>Find Hospitals</span>
                                </button>
                                <button 
                                    onClick={() => setIsDoctorSearch(true)}
                                    className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${isDoctorSearch ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                >
                                    <Stethoscope size={18} />
                                    <span>Find Doctors</span>
                                </button>
                            </div>
                            
                            {/* Search input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isDoctorSearch ? "Search by doctor name..." : "Search by hospital name..."}
                                    className="w-full px-5 py-4 pl-12 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <button 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
                                    onClick={() => {
                                        if(isDoctorSearch){
                                            navigate(`/search?doctorName=${searchTerm}`); 
                                        }else{
                                            navigate(`/search?hospitalName=${searchTerm}`);
                                        }
                                    }}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Results for hospitals */}
                        {showResults && results.length > 0 && (
                            <div className="absolute w-full mt-2 max-h-80 overflow-y-auto z-20">
                                <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                                    {results.slice(0, 5).map((result, index) => (
                                        <Link to={`/${result._id}/hospitalreview`}
                                            key={result._id}
                                            className={`block cursor-pointer py-4 px-5 border-b border-gray-100 ${
                                                index === selectedIndex
                                                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                                : 'hover:bg-blue-50'
                                            }`}
                                            onClick={() => {
                                                setSearchTerm(result.name);
                                                setShowResults(false);
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-full">
                                                    <Building2 className="text-blue-600" size={20} />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-semibold text-gray-800">{result.name}</p>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <MapPin size={14} className="mr-1" />
                                                        <span>{result.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results for doctors */}
                        {showDocResults && results.length > 0 && (
                            <div className="absolute w-full mt-2 max-h-80 overflow-y-auto z-20">
                                <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                                    {results.slice(0, 5).map((result, index) => (
                                        <Link to={`/${result._id}/doctorreview`}
                                            key={result._id}
                                            className={`block cursor-pointer py-4 px-5 border-b border-gray-100 ${
                                                index === selectedIndex
                                                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                                : 'hover:bg-blue-50'
                                            }`}
                                            onClick={() => {
                                                setSearchTerm(result.name);
                                                setShowDocResults(false);
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-full">
                                                    <Stethoscope className="text-blue-600" size={20} />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-semibold text-gray-800">{result.name}</p>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <Building2 size={14} className="mr-1" />
                                                        <span>{result.hospital.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No results message */}
                        {(showResults || showDocResults) && results.length === 0 && (
                            <div className="absolute w-full mt-2 z-20">
                                <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                                    <div className="px-5 py-4 text-gray-500 flex items-center justify-center">
                                        <Search className="mr-2 text-gray-400" size={18} />
                                        No results found for "{searchTerm}"
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tagline */}
                    <p className="mt-10 font-light text-white/90">
                        MediMind - Your trusted healthcare companion
                    </p>
                </div>

                {/* Footer */}
                <div className="absolute bottom-4 z-10 text-white/70 text-sm">
                    © 2025 MediMind. All rights reserved.
                </div>
            </section>
        </div>
    )
}

export default FinHome