import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Homesublast() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const navigate = useNavigate();  // Use the React Router's useNavigate hook

  const handleNavigate = (route) => {
    navigate('/doctors');  // Use React Router's navigation
  };
  // Doctor data
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 124
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 4.8,
      reviews: 98
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      rating: 4.9,
      reviews: 156
    }
  ];
  
  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-yellow-400" size={16} />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Top Rated
          </div>
          <h1 
            className={`text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-700 ${
              isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
            }`}
          >
            Our Top Doctors
          </h1>
          <p 
            className={`text-lg text-gray-600 transform transition-all duration-700 delay-100 ${
              isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
            }`}
          >
            Highly qualified and experienced doctors rated by our patients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className={`bg-gray-100 rounded-lg overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-2 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 150 + 200}ms`,
                transitionProperty: 'transform, opacity, box-shadow'
              }}
            >
              <div 
               style={
                {backgroundImage:"url('https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",backgroundSize:"cover",backgroundPosition:"center"}
               }
               className="h-64 bg-gray-200 flex items-center justify-center">
                
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600 mb-3">{doctor.specialty}</p>
                <div className="flex items-center mb-4">
                  {renderStars(doctor.rating)}
                  <span className="ml-2 font-medium">{doctor.rating}</span>
                  <span className="text-gray-500 ml-2">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200">
                    View Profile
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className={`text-center mt-10 transform transition-all duration-700 delay-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <button onClick={handleNavigate} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
            View All Doctors
          </button>
        </div>
      </div>
    </div>
  );
}