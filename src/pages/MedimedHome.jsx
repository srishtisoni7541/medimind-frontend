import React from "react";
import { Search, MapPin } from 'lucide-react';

const MedimedHome = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-emerald-500 via-teal-600 to-[#1B5170] relative overflow-hidden">
      {/* Background medical icons */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[20%] left-[10%]">
          <img src="/placeholder.svg" width={50} height={100} alt="" className="opacity-30" />
        </div>
        <div className="absolute bottom-[30%] left-[20%]">
          <img src="/placeholder.svg" width={50} height={50} alt="" className="opacity-30" />
        </div>
        <div className="absolute top-[40%] right-[15%]">
          <img src="/placeholder.svg" width={80} height={80} alt="" className="opacity-30" />
        </div>
        <div className="absolute bottom-[20%] right-[10%]">
          <img src="/placeholder.svg" width={50} height={100} alt="" className="opacity-30" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10">
              <svg viewBox="0 0 40 40" className="h-full w-full">
                <path d="M0 0 L40 0 L40 30 L20 40 L0 30 Z" fill="#f97316" />
                <path d="M0 0 L40 0 L40 30 L20 40 Z" fill="#f59e0b" opacity="0.7" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-800">Medica Help</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-white hover:text-gray-200 transition">
              Home
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition">
              Appointment
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition">
              Services
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition">
              Specialist
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition">
              FAQ
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition">
              About us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 rounded-full border border-white text-white hover:bg-white/10 transition">
              Sign in
            </button>
            <button className="px-4 py-1.5 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">Need To Quickly Consult With</h2>
          <div className="flex justify-center items-center gap-3">
            <h2 className="text-4xl md:text-5xl font-medium text-white">Doctor?</h2>
            <div className="relative">
              <svg width="100" height="80" viewBox="0 0 100 80" className="text-white">
                <path d="M20,40 Q30,10 50,30 T80,20" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="80" cy="20" r="5" fill="white" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg width="50" height="50" viewBox="0 0 50 50" className="text-white">
                  <circle cx="25" cy="15" r="15" fill="currentColor" />
                  <rect x="20" y="15" width="10" height="25" rx="5" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-full p-2 flex items-center shadow-lg">
            <div className="flex items-center flex-1 px-3 border-r border-gray-300">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Specialist or Hospital"
                className="w-full outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center px-3 border-r border-gray-300">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <select className="appearance-none bg-transparent outline-none text-gray-700 pr-8">
                <option>Near you or Enter City</option>
              </select>
            </div>
            <div className="px-2">
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full transition">
                Find
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedimedHome;