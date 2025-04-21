import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { searchHospitals, clearHosError, clearHospitals } from '../store/actions/hospitalaction';
import { searchDoctors, clearDoctors } from '../store/actions/doctoraction';
import { useSnackbar } from 'notistack';
import VoiceControl from '../components/VoiceFunc';

function Doctorsearch() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { hospitals, error } = useSelector((state) => state.Hospital);
  const { doctors } = useSelector((state) => state.Doctor);
  const doctorError = useSelector((state) => state.Doctor.error);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('hospital');
  const [showResults, setShowResults] = useState(false);
  const [showDocResults, setShowDocResults] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const recognitionRef = useRef(null);
  
  // Parse query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hospitalName = queryParams.get('hospitalName');
    const doctorName = queryParams.get('doctorName');
    
    if (hospitalName) {
      setSearchType('hospital');
      setSearchTerm(hospitalName);
    } else if (doctorName) {
      setSearchType('doctor');
      setSearchTerm(doctorName);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      setShowResults(false);
      setShowDocResults(false);
      dispatch(clearHospitals());
      dispatch(clearDoctors());
      return;
    }
    
    // Clear previous results
    dispatch(clearHospitals());
    dispatch(clearDoctors());
    
    if (searchType === 'doctor') {
      dispatch(searchDoctors({ name: searchTerm }));
    } else {
      dispatch(searchHospitals({ name: searchTerm }));
    }
  }, [searchTerm, searchType, dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearHosError());
    } else if (doctorError) {
      enqueueSnackbar(doctorError, { variant: "error" });
    }
  }, [error, doctorError, dispatch, enqueueSnackbar]);

  useEffect(() => {
    // Only update results if the current search type matches the data type
    if (searchType === 'doctor') {
      if (doctors && doctors.length > 0) {
        setResults(doctors);
        setShowDocResults(true);
        setShowResults(false);
      } else {
        setResults([]);
        setShowDocResults(false);
        setShowResults(false);
      }
    } else if (searchType === 'hospital') {
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
  }, [hospitals, doctors, searchType]);

  const handleSearchTypeChange = (e) => {
    const newSearchType = e.target.value;
    
    // Clear results immediately when search type changes
    setResults([]);
    setShowResults(false);
    setShowDocResults(false);
    
    // Clear previous data in Redux store
    dispatch(clearHospitals());
    dispatch(clearDoctors());
    
    // Update the search type
    setSearchType(newSearchType);
    
    // Update URL to reflect the new search type
    const queryParams = new URLSearchParams();
    if (searchTerm.trim() !== "") {
      if (newSearchType === 'doctor') {
        queryParams.set('doctorName', searchTerm);
      } else {
        queryParams.set('hospitalName', searchTerm);
      }
      navigate(`?${queryParams.toString()}`);
    }
    
    // If there's an active search term, trigger search with new type
    if (searchTerm.trim() !== "") {
      if (newSearchType === 'doctor') {
        dispatch(searchDoctors({ name: searchTerm }));
      } else {
        dispatch(searchHospitals({ name: searchTerm }));
      }
    }
  };
  
  const handleSearchInput = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Update URL with the new search term
    if (newSearchTerm.trim() !== "") {
      const queryParams = new URLSearchParams();
      if (searchType === 'doctor') {
        queryParams.set('doctorName', newSearchTerm);
      } else {
        queryParams.set('hospitalName', newSearchTerm);
      }
      navigate(`?${queryParams.toString()}`);
    } else {
      // Clear URL params if search is empty
      navigate('');
    }
  };

  // Start voice search functionality
  const startVoiceSearch = () => {
    if (!recognitionRef.current) {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsVoiceSearching(true);
          enqueueSnackbar("Listening for search...", { variant: "info" });
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchTerm(transcript);
          
          // Update URL with the new search term
          const queryParams = new URLSearchParams();
          if (searchType === 'doctor') {
            queryParams.set('doctorName', transcript);
          } else {
            queryParams.set('hospitalName', transcript);
          }
          navigate(`?${queryParams.toString()}`);
          
          enqueueSnackbar(`Searching for: "${transcript}"`, { variant: "success" });
        };
        
        recognitionRef.current.onerror = (event) => {
          enqueueSnackbar(`Voice search error: ${event.error}`, { variant: "error" });
          setIsVoiceSearching(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsVoiceSearching(false);
        };
      } else {
        enqueueSnackbar("Speech recognition not supported in this browser", { variant: "error" });
        return;
      }
    }
    
    recognitionRef.current.start();
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.0) return 'bg-emerald-400';
    if (rating >= 3.5) return 'bg-yellow-300';
    return 'bg-yellow-200';
  };
  
  return (
   <>
    <div className="min-h-screen p-6 ">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {searchType === 'doctor' ? 'Find Your Doctor' : 'Find a Hospital'}
          </h1>
          <p className="text-gray-600">
            Search through {searchType === 'doctor' ? `${results.length} qualified medical professionals` : `${results.length} medical facilities`}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={`Search by ${searchType} name...`}
                value={searchTerm}
                onChange={handleSearchInput}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
              {/* Voice search button */}
              <button 
                onClick={startVoiceSearch}
                className={`absolute inset-y-0 right-2 px-2 flex items-center ${isVoiceSearching ? 'text-red-500' : 'text-gray-500'}`}
                title="Search by voice"
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
                {isVoiceSearching && (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
                )}
              </button>
            </div>
            <div className="relative">
              <select
                value={searchType}
                onChange={handleSearchTypeChange}
                className="w-full md:w-64 px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors appearance-none"
              >
                <option value="doctor">Search Doctors</option>
                <option value="hospital">Search Hospitals</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          {searchType === 'doctor' ? (
            // Doctor Cards
            results.length > 0 && results.map(doctor => (
              <Link to={`/${doctor._id}/doctorreview`} key={doctor._id} className="bg-white block rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
                <div className="flex items-start gap-6">
                  <div className={`${getRatingColor(doctor.rating)} h-16 w-16 rounded-xl flex flex-col items-center justify-center shrink-0`}>
                    <div className="text-2xl font-bold">{doctor.rating.toFixed(1)}</div>
                    <div className="text-xs font-medium">RATING</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {doctor.hospital && doctor.hospital.name}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {doctor.reviews ? doctor.reviews.length : 0} ratings
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Hospital Cards
            results.length > 0 && results.map(hospital => (
              <Link to={`/${hospital._id}/hospitalreview`} key={hospital._id} className="bg-white block rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
                <div className="flex items-start gap-6">
                  <div className={`${getRatingColor(hospital.rating ? hospital.rating.toFixed(1) : 0)} h-16 w-16 rounded-xl flex flex-col items-center justify-center shrink-0`}>
                    <div className="text-2xl font-bold">{hospital.rating ? hospital.rating.toFixed(1) : 0}</div>
                    <div className="text-xs font-medium">RATING</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{hospital.name} <span className='text-sm font-normal'>( {hospital.hospitalType} hospital )</span></h2>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{hospital.address} Beds</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialties && hospital.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-gray-600">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {hospital.reviews ? hospital.reviews.length : 0} ratings
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
          
          {searchTerm.trim() !== "" && results.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <p className="text-gray-600">No {searchType === 'doctor' ? 'doctors' : 'hospitals'} found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Global voice control component */}
    <VoiceControl />
   </>
  );
}

export default Doctorsearch;