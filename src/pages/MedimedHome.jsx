import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {  Calendar, Star, Brain, Pill, ClipboardList, Hospital, Heart, ArrowRight } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MedimedHome = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aiToolsRef = useRef(null);
  const accessibilityRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Hero section animation
    gsap.from(heroRef.current.querySelectorAll('.animate-hero'), {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    });

    // Features section animation
    gsap.from(featuresRef.current.querySelectorAll('.feature-card'), {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
      }
    });

    // AI Tools section animation
    gsap.from(aiToolsRef.current.querySelectorAll('.ai-tool'), {
      scale: 0.9,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      scrollTrigger: {
        trigger: aiToolsRef.current,
        start: "top 75%",
      }
    });

    // Accessibility section animation
    gsap.from(accessibilityRef.current.querySelectorAll('.accessibility-item'), {
      x: -30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: accessibilityRef.current,
        start: "top 80%",
      }
    });

    // CTA section animation
    gsap.from(ctaRef.current.querySelectorAll('.animate-cta'), {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 85%",
      }
    });
  }, []);

  return (
    <div className="font-sans text-gray-800">

      {/* Hero Section */}
      <section ref={heroRef} className="pb-16 px-16 h-screen max-sm:px-4 flex items-center md:pb-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="animate-hero text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
                Your Complete Healthcare <span className="text-blue-600">Wellness</span> Solution
              </h1>
              <p className="animate-hero text-lg md:text-xl text-gray-600 mb-8">
                AI-powered healthcare platform with appointment scheduling, symptom checking, and more - all designed to be accessible for everyone.
              </p>
              <div className="animate-hero flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Book Appointment <ArrowRight size={18} className="ml-2" />
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                  Symptom Checker <Brain size={18} className="ml-2" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="animate-hero relative w-full">
                <img 
                  src="./src/assets/homepage-image.jpg" 
                  alt="MediMind Healthcare App" 
                  className="w-full"
                />
                <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Star className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-3">
                      <p className="font-bold">4.9/5 Rating</p>
                      <p className="text-sm text-gray-500">from 2,500+ users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-16 px-16  max-sm:px-0 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empowering you with innovative healthcare tools and features for a better wellness experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-white rounded-xl p-6 shadow-md hover:bg-blue-50 transition-shadow duration-500 border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Calendar className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Appointment Booking</h3>
              <p className="text-gray-600">
                Schedule appointments with doctors easily and receive reminders. Reschedule or cancel with just a click.
              </p>
            </div>
            
            <div className="feature-card bg-white rounded-xl p-6 shadow-md hover:bg-blue-50 transition-shadow duration-500 border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Doctor Ratings & Reviews</h3>
              <p className="text-gray-600">
                Find the best healthcare providers with our transparent rating system and authentic patient reviews.
              </p>
            </div>
            
            <div className="feature-card bg-white rounded-xl p-6 shadow-md hover:bg-blue-50 transition-shadow duration-500 border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Hospital className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Hospital Finder</h3>
              <p className="text-gray-600">
                Locate the nearest hospitals and healthcare facilities with detailed information about services.
              </p>
            </div>
            
            <div className="feature-card bg-white rounded-xl p-6 shadow-md hover:bg-blue-50 transition-shadow duration-500 border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Medical Prescriptions</h3>
              <p className="text-gray-600">
                Access and manage your medical prescriptions digitally with reminders for medication.
              </p>
            </div>
            
            <div className="feature-card bg-white rounded-xl p-6 shadow-md hover:bg-blue-50 transition-shadow duration-500 border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Pill className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Pill Identifier</h3>
              <p className="text-gray-600">
                Identify unknown medications with our AI-powered pill recognition system for your safety.
              </p>
            </div>
            
            <div className="feature-card bg-white rounded-xl p-6 shadow-md hover:bg-blue-50 transition-shadow duration-500 border border-gray-100">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <img src="https://img.icons8.com/?size=100&id=EKa8H6wQHpwh&format=png&color=FFFFFF" alt="" className='h-7' />
              </div>
              <h3 className="text-xl font-bold mb-3">Admin Panel</h3>
              <p className="text-gray-600">
                Dedicated dashboards for doctors, patients, and hospital administrators for seamless management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section id="ai-tools" ref={aiToolsRef} className="py-16 px-16  max-sm:px-0 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Healthcare Tools</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge artificial intelligence to enhance your healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="ai-tool bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Brain className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold ml-4">AI Symptom Checker</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Our advanced AI analyzes your symptoms and provides potential causes, recommending the appropriate specialist to consult.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">
                    "The symptom checker was incredibly accurate and saved me an unnecessary trip to the ER. uyguyjbjhb"
                  </p>
                  <p className="text-sm font-bold mt-2">- Rajesh K., Delhi</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex justify-between items-center">
                <span className="text-white font-medium">Try Symptom Checker</span>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                  Start Now
                </button>
              </div>
            </div>
            
            <div className="ai-tool bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Pill className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold ml-4">AI Pill Identifier</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Upload a photo of any pill, and our AI will identify it, providing information about the medication and potential side effects.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">
                    "I found an unlabeled pill at home and identified it instantly with the app. Very impressive technology!"
                  </p>
                  <p className="text-sm font-bold mt-2">- Priya S., Mumbai</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex justify-between items-center">
                <span className="text-white font-medium">Try Pill Identifier</span>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                  Upload Photo
                </button>
              </div>
            </div>
            
            <div className="ai-tool bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <ClipboardList className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold ml-4">AI Prescription Analyzer</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Our AI reads and interprets prescriptions, providing easy-to-understand medication instructions and potential drug interactions.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">
                    "The prescription analyzer helped me understand my complex medication schedule after surgery."
                  </p>
                  <p className="text-sm font-bold mt-2">- Amit P., Bangalore</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex justify-between items-center">
                <span className="text-white font-medium">Try Prescription Analyzer</span>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                  Scan Prescription
                </button>
              </div>
            </div>
            
            <div className="ai-tool bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold ml-4">Smart Appointment Scheduler</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Our AI suggests the best appointment times based on doctor availability, urgency of your condition, and your personal schedule.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">
                    "The smart scheduler found me an urgent appointment when all slots seemed booked. Truly intelligent!"
                  </p>
                  <p className="text-sm font-bold mt-2">- Neha T., Hyderabad</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex justify-between items-center">
                <span className="text-white font-medium">Try Smart Scheduler</span>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                  Find Time Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section id="accessibility" ref={accessibilityRef} className="py-16 px-16  max-sm:px-0 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Accessible For Everyone</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We believe healthcare should be accessible to all. Our platform is designed with accessibility features to ensure everyone can use it with ease.
              </p>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="space-y-6">
                <div className="accessibility-item flex items-start">
                  <div className="bg-blue-600 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">Screen Reader Compatible</h3>
                    <p className="text-gray-600">Fully compatible with all popular screen readers for visually impaired users.</p>
                  </div>
                </div>
                
                <div className="accessibility-item flex items-start">
                  <div className="bg-blue-600 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">Voice Navigation</h3>
                    <p className="text-gray-600">Navigate through the app using voice commands for motor-impaired users.</p>
                  </div>
                </div>
                
                <div className="accessibility-item flex items-start">
                  <div className="bg-blue-600 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">High Contrast Mode</h3>
                    <p className="text-gray-600">Switch to high contrast mode for better visibility and readability.</p>
                  </div>
                </div>
                
                <div className="accessibility-item flex items-start">
                  <div className="bg-blue-600 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">Multi-language Support</h3>
                    <p className="text-gray-600">Available in multiple Indian languages for wider accessibility.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://miro.medium.com/v2/resize:fit:1400/1*IOlSmJSsRgavDSQTLOVJoQ.png" 
                alt="Accessibility Features" 
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 md:py-24 bg-gradient-to-br px-16  max-sm:px-8 from-sky-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="animate-cta text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
          <p className="animate-cta text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from our AI-powered healthcare platform.
          </p>
          <div className="animate-cta flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
              Book a Demo
            </button>
          </div>
          <div className="animate-cta mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar size={24} />
              </div>
              <span className="ml-2 font-medium">10,000+ Appointments</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Star size={24} />
              </div>
              <span className="ml-2 font-medium">500+ Doctors</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Heart size={24} />
              </div>
              <span className="ml-2 font-medium">98% Satisfaction</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedimedHome;