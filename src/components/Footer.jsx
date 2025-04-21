import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 pt-12 pb-8 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-8 justify-between">
          {/* Logo and About Section */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <div className="mb-6">
              <h2 className="text-3xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 14H14V18H10V14H6V10H10V6H14V10H18V14Z" />
                        </svg>
                <span className="text-gray-800">MediMind</span>
              </h2>
              <p className="mt-4 text-gray-600">
                Your trusted healthcare partner providing comprehensive medical services and resources.
              </p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Services Section */}
          <div className="w-full md:w-56 mb-8 md:mb-0 md:ml-6">
            <h3 className="text-xl font-semibold mb-6 text-blue-600">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Find Doctors</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Symptom Checker</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Health Plan</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Pill Identifier</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Blogs</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Company Section */}
          <div className="w-full md:w-56 mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-6 text-blue-600">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Press</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 block hover:translate-x-2 transform">Contact Us</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div className="w-full md:w-64">
            <h3 className="text-xl font-semibold mb-6 text-blue-600">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start group">
                <MapPin className="mr-3 text-blue-600 flex-shrink-0 mt-1 group-hover:text-blue-800 transition-all duration-300" size={18} />
                <p className="text-gray-600 group-hover:text-gray-900 transition-all duration-300">123 Medical Center Dr, Healthcare City, HC 12345</p>
              </div>
              <div className="flex items-center group">
                <Phone className="mr-3 text-blue-600 group-hover:text-blue-800 transition-all duration-300" size={18} />
                <p className="text-gray-600 group-hover:text-gray-900 transition-all duration-300">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center group">
                <Mail className="mr-3 text-blue-600 group-hover:text-blue-800 transition-all duration-300" size={18} />
                <p className="text-gray-600 group-hover:text-gray-900 transition-all duration-300">contact@medimad.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500">
          <p className="hover:text-blue-600 transition-all duration-300">&copy; {new Date().getFullYear()} MediMad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;