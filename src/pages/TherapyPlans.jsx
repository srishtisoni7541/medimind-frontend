import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { AppContext } from '../context/AppContext';
import MentalNav from '../components/MentalNav';
const TherapyPlans = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [creating, setCreating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const {  backendUrl,token} = useContext(AppContext);
  console.log(token);
  
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/analysis/therapy-plans`,{ headers: { utoken: token } });
      
      setPlans(res.data.plans);
      
      // Set most recent plan as current if available
      if (res.data.plans.length > 0) {
        setCurrentPlan(res.data.plans[0]);
      }
    } catch (err) {
      console.error('Error fetching therapy plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      setCreating(true);
      const res = await axios.post(`${backendUrl}/api/analysis/therapy-plan`, {}, {
        headers: { utoken: token }
      });
      setPlans(prevPlans => [res.data.plan, ...prevPlans]);
      setCurrentPlan(res.data.plan);
    } catch (err) {
      console.error('Error generating therapy plan:', err);
      alert('Failed to generate therapy plan. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const selectPlan = (plan) => {
    setCurrentPlan(plan);
  };

  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading therapy plans...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50">
      <MentalNav/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-bold text-blue-700">Therapy Plans</h1>
          <button 
            onClick={generateNewPlan} 
            className={`px-4 py-2 rounded-lg font-medium text-white shadow transition-colors ${creating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={creating}
          >
            {creating ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </div>
            ) : 'Generate New Plan'}
          </button>
        </div>
        
        {plans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">No therapy plans available yet</h2>
              <p className="text-gray-600 max-w-md">Generate your first personalized therapy plan based on your journal entries and mood data.</p>
              <button 
                onClick={generateNewPlan} 
                className={`mt-6 px-6 py-3 rounded-lg font-medium text-white shadow transition-colors ${creating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={creating}
              >
                {creating ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </div>
                ) : 'Generate Your First Plan'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b border-gray-100 pb-2">Your Plans</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {plans.map((plan) => (
                    <div 
                      key={plan._id} 
                      className={`rounded-lg p-3 cursor-pointer transition-colors ${currentPlan?._id === plan._id 
                        ? 'bg-blue-100 border-l-4 border-blue-600' 
                        : 'bg-gray-50 hover:bg-blue-50'}`}
                      onClick={() => selectPlan(plan)}
                    >
                      <div className="font-medium text-gray-800">
                        {plan.title || 'Therapy Plan'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(plan.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {currentPlan ? (
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">{currentPlan.title || 'Personalized Therapy Plan'}</h2>
                  <div className="text-sm text-gray-500 mb-6">
                    Created on {new Date(currentPlan.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {currentPlan.overview && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Overview
                      </h3>
                      <p className="text-gray-700">{currentPlan.overview}</p>
                    </div>
                  )}
                  
                  {currentPlan.goals && currentPlan.goals.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Goals
                      </h3>
                      <div className="space-y-2">
                        {currentPlan.goals.map((goal, index) => (
                          <div key={index} className="flex items-start bg-blue-50 rounded-lg p-3">
                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 mt-0.5">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-gray-700">{goal.description}</p>
                              {goal.targetDate && (
                                <p className="text-sm text-blue-600 mt-1">
                                  Target date: {new Date(goal.targetDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentPlan.techniques && currentPlan.techniques.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Recommended Techniques
                      </h3>
                      <div className="space-y-4">
                        {currentPlan.techniques.map((technique, index) => (
                          <div key={index} className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-blue-600">{technique.name}</h4>
                            <p className="text-gray-700 my-2">{technique.description}</p>
                            {technique.frequency && (
                              <p className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                                {technique.frequency}
                              </p>
                            )}
                            {technique.steps && (
                              <div className="mt-3 pl-4 border-l-2 border-blue-100">
                                <ol className="list-decimal list-inside text-gray-700 space-y-1">
                                  {technique.steps.map((step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentPlan.resources && currentPlan.resources.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Resources
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentPlan.resources.map((resource, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 flex">
                            <div className="bg-blue-100 text-blue-600 rounded-md p-2 mr-3">
                              {resource.type === 'article' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                              )}
                              {resource.type === 'video' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {resource.type === 'exercise' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                              )}
                              {resource.type === 'professional' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{resource.title}</h4>
                              {resource.description && (
                                <p className="text-sm text-gray-600">{resource.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentPlan.nextSteps && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        Next Steps
                      </h3>
                      <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{currentPlan.nextSteps}</p>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors">
                      Download Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-3 flex items-center justify-center bg-white rounded-xl shadow-md p-6 h-64">
                <p className="text-gray-500">Select a plan to view details</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapyPlans;