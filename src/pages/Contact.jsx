import React from 'react'
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
  };
  
  return (
    <div className="bg-white min-h-screen mb-20">
      <div>
        <h1 className='text-center text-lg font-semibold mb-12 mt-12'>Contact Us</h1>
      </div>
      {/* Contact Information Icons */}
      <div className="mb-12 bg-[#F0F6FE] p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {/* Email Address */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-3">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Email Address</h3>
            <p className="text-gray-500 text-xs mt-1">info@example.com</p>
            <p className="text-gray-500 text-xs">contact@example.com</p>
          </div>
          
          {/* Phone Number */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-3">
              <Phone className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Phone Number</h3>
            <p className="text-gray-500 text-xs mt-1">(123) 456-7890</p>
            <p className="text-gray-500 text-xs">(123) 456-7891</p>
          </div>
          
          {/* Office Location */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-3">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Office Location</h3>
            <p className="text-gray-500 text-xs mt-1">123 Medical Avenue</p>
            <p className="text-gray-500 text-xs">New World Center, US</p>
          </div>
          
          {/* Work Day */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-3">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-800">Work Day</h3>
            <p className="text-gray-500 text-xs mt-1">Mon - Sun: 09:00</p>
            <p className="text-gray-500 text-xs">Sat - Mon: 10:00</p>
          </div>
        </div>
      </div>
      
      {/* Main Contact Section */}
      <div className="">
      <div className="bg-white ">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Right Side - Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-full max-h-[500px]">
              <img 
                src={""}
                alt="Healthcare professionals" 
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 pr-0 lg:pr-6 mb-8 lg:mb-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mt-1">Get In Touch With Us</h2>
              <p className="text-gray-500 text-sm mt-3">
                Get in touch with our healthcare professionals and let us know how we can help. 
                We're here to provide you with the care you need.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="bg-blue-50 w-full px-4 py-2 rounded-md border border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="bg-blue-50 w-full px-4 py-2 rounded-md border border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="bg-blue-50 w-full px-4 py-2 rounded-md border border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="bg-blue-50 w-full px-4 py-2 rounded-md border border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="bg-blue-50 w-full px-4 py-2 rounded-md border border-blue-500 focus:outline-none text-gray-400"
                        required
                      >
                        <option value="">Inquiry Type</option>
                        <option value="appointment">Appointment Question</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="records">Medical Records</option>
                        <option value="services">Services Information</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                
              
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="5"
                className="bg-blue-50 w-full px-4 py-2 rounded-md border border-blue-500 focus:outline-none"
              ></textarea>
              
              <button
                type="submit"
                className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md w-full hover:bg-blue-600 transition duration-300"
              >
                Get In Touch
              </button>
            </form>
          </div>
          
          
        </div>
      </div>
      </div>
    </div>
  );
}

export default Contact