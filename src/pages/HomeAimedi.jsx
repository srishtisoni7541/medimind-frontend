import React from 'react';
import { Link } from 'react-router-dom';
import MedicationSearch from '../components/MedicationSearch';

const topSearchedMedications = [
  'Actos', 'Acyclovir', 'Clonazepam', 'Crestor', 
  'Lisdexamfetamine', 'Lisinopril', 'Pravastatin', 'Prednisone'
];

const HomeAimedi = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Drugs & Medications A-Z</h1>
          <p className="text-lg text-gray-600">Your trusted source of information for prescription drugs and medications</p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <MedicationSearch />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button className="text-left text-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Search Medications by Letter
            </button>
            <button className="text-left text-primary">
              Search Medications by Condition
            </button>
            <button className="text-left text-primary">
              Find Off-Market Medications
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-center font-medium">Pill Identifier</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <span className="text-center font-medium">Drugs Interaction Checker</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-center font-medium">Find Vitamins</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-center font-medium">Find a Doctor</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center">Top Searched Medications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topSearchedMedications.map((medication, index) => (
              <Link 
                key={index} 
                to={`/medication/${medication}`}
                className="hover:bg-white hover:shadow-md transition-all p-3 rounded-md"
              >
                {medication}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">MORE ON DRUGS & MEDICATIONS</h3>
          <div className="flex items-start gap-4">
            <span className="text-xl font-bold bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">1</span>
            <p className="text-lg">Drug Recalls: What Do They Mean?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAimedi;