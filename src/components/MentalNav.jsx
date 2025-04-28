import React from 'react';
import { Link } from 'react-router-dom';

const MentalNav = () => {
  return (
    <nav className="w-full bg-blue-600 shadow-md my-8">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        

        {/* Links */}
        <div className="flex space-x-6">
          <Link to="/dashboard-mood" className="text-white hover:text-blue-200 transition-colors duration-200">
            View Dashboard
          </Link>
          <Link to="/journal" className="text-white hover:text-blue-200 transition-colors duration-200">
            Journal
          </Link>
          <Link to="/mood-trends" className="text-white hover:text-blue-200 transition-colors duration-200">
            Mood Trends
          </Link>
          <Link to="/insights" className="text-white hover:text-blue-200 transition-colors duration-200">
            Insights
          </Link>
          <Link to="/therapy-plans" className="text-white hover:text-blue-200 transition-colors duration-200">
            Therapy Plans
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MentalNav;
