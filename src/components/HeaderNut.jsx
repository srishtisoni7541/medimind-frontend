// client/src/components/HeaderNut.js
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderNut = () => {
  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-500 py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold">
          NutriPlan
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm">Your Personalized Diet Planner</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderNut;