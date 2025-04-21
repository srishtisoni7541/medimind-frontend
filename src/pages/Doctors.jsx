import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Calendar, MapPin, Star, Filter, Search, X, ChevronDown } from 'lucide-react';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoctor, setFilterDoctor] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  
  // List of all specialities
  const specialities = [
    'General physician',
    'Gynaecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  useEffect(() => {
    if (speciality) {
      let filtered = doctors.filter(doctor => doctor.speciality === speciality);
      
      // Apply search filter if exists
      if (searchTerm) {
        filtered = filtered.filter(doctor => 
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply rating filter if selected
      if (selectedRating) {
        filtered = filtered.filter(doctor => doctor.rating >= selectedRating);
      }
      
      setFilterDoctor(filtered);
    } else {
      let filtered = [...doctors];
      
      // Apply search filter if exists
      if (searchTerm) {
        filtered = filtered.filter(doctor => 
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply rating filter if selected
      if (selectedRating) {
        filtered = filtered.filter(doctor => doctor.rating >= selectedRating);
      }
      
      setFilterDoctor(filtered);
    }
  }, [doctors, speciality, searchTerm, selectedRating]);

  // Function to handle selecting a rating filter
  const handleRatingFilter = (rating) => {
    if (selectedRating === rating) {
      setSelectedRating(null); // Toggle off if already selected
    } else {
      setSelectedRating(rating);
    }
  };

  // Function to clear all filters
  const clearFilters = () => {
    navigate('/doctors');
    setSearchTerm('');
    setSelectedRating(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 ">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Find Your Doctor</h1>
        <p className="text-gray-600 mt-2">Browse through our network of qualified healthcare professionals</p>
      </div>
      
    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Need more healthcare options?</h2>
            <p className="text-gray-600 text-sm mt-1">Find doctors, hospitals, book appointments and see ratings all in one place.</p>
          </div>
          <button 
            onClick={() => navigate('/find-doc')}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Find Healthcare Services
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar - desktop */}
        <div className="hidden md:block w-64 flex-shrink-0 bg-white rounded-xl shadow-md p-5 h-fit sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />
              Filters
            </h3>
            {(speciality || selectedRating) && (
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="border-b pb-4 mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Specialties</h4>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2">
              {specialities.map((spec) => (
                <div 
                  key={spec}
                  onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                    speciality === spec ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    speciality === spec ? 'border-blue-600' : 'border-gray-400'
                  }`}>
                    {speciality === spec && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className="text-sm">{spec}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2].map((rating) => (
                <div 
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                    selectedRating === rating ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedRating === rating ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                  }`}>
                    {selectedRating === rating && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex items-center">
                    {Array(rating).fill(0).map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-sm ml-1">& Up</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile filter accordion */}
        {showFilter && (
          <div className="md:hidden w-full bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                Filter Options
              </h3>
              {(speciality || selectedRating) && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <div 
                className="flex items-center justify-between py-2 cursor-pointer"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                <h4 className="font-medium text-gray-700">Specialties</h4>
                <ChevronDown size={18} className={`text-gray-500 transition-transform ${isFilterExpanded ? 'transform rotate-180' : ''}`} />
              </div>
              
              {isFilterExpanded && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialities.map((spec) => (
                    <div 
                      key={spec}
                      onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                      className={`flex items-center gap-1 p-2 rounded cursor-pointer transition-all text-sm ${
                        speciality === spec ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Rating</h4>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2].map((rating) => (
                  <div 
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    className={`flex items-center gap-1 p-2 rounded cursor-pointer transition-all text-sm ${
                      selectedRating === rating ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {Array(rating).fill(0).map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-xs ml-1">& Up</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Doctor cards grid */}
        <div className="flex-1">
          {/* Results info */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-700">
                {filterDoctor.length} {filterDoctor.length === 1 ? 'doctor' : 'doctors'} found
                {speciality ? ` in ${speciality}` : ''}
                {searchTerm ? ` for "${searchTerm}"` : ''}
              </p>
            </div>
            <div className="hidden md:block">
              <button 
                onClick={() => setShowFilter(prev => !prev)}
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <Filter size={16} />
                {showFilter ? 'Hide filters' : 'Show filters'}
              </button>
            </div>
          </div>
          
          {filterDoctor.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? `No results matching "${searchTerm}"` : 'Try adjusting your filters or search criteria'}
              </p>
              <button 
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDoctor.map((doctor) => (
                <div 
                  key={doctor._id} 
                  onClick={() => navigate(`/appointment/${doctor._id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doctor.available ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center mb-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < (doctor.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{doctor.rating || 0}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-3">{doctor.speciality}</p>
                    
                    {doctor.location && (
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin size={14} className="mr-1" />
                        <span>{doctor.location}</span>
                      </div>
                    )}
                    
                    {doctor.experience && (
                      <p className="text-sm text-gray-600 mb-3">
                        {doctor.experience} years of experience
                      </p>
                    )}
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      {doctor.fee && (
                        <p className="text-gray-900 font-medium">${doctor.fee}</p>
                      )}
                      <button 
                        className="bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/appointment/${doctor._id}`);
                        }}
                      >
                        <Calendar size={14} />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;