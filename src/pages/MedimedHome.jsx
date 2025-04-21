import React from 'react';
import { useNavigate } from 'react-router-dom';
import Homesub from './Homesub';
import Homesublast from './Homesublast';

const MedimedHome = () => {
  const navigate = useNavigate();

  return (
    <>
    <section className="flex mt-[15vh] items-center justify-between px-10 py-20 bg-gradient-to-r from-[#e6efff] to-[#d4e6ff]">
      {/* Left Text Content */}
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold text-black mb-6">
          Your Health, Our Priority
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Find the best doctors, hospitals, and healthcare services all in one place. 
          Book appointments, consult online, and get the care you deserve.
        </p>
        <div className="flex gap-4">
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate('/doctors')}
          >
            Find a Doctor
          </button>
          <button 
            className="bg-white border border-gray-300 text-black px-6 py-3 rounded-md hover:bg-gray-100 transition"
            onClick={() => navigate('/doctors')}
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Placeholder for Image */}
      <div className="w-[500px] h-[400px]  rounded-xl flex items-center justify-center">
        <div className=" ">
          <img className='w-full h-full object-cover object-center' src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        </div>
      </div>
     
    </section>
    <Homesub/>
    <Homesublast/>
    </>
    
  );
};

export default MedimedHome;