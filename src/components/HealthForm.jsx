import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const HealthForm = ({ setUserData, setMealPlan, handleApiRequest, isLoading: globalLoading }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',  
    weight: '',  
    activityLevel: 'moderate',
    weightGoal: 'maintain'
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Use either global or local loading state
  const isLoading = globalLoading || localLoading;

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 times/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 times/week)' },
    { value: 'active', label: 'Active (exercise 6-7 times/week)' },
    { value: 'very_active', label: 'Very Active (intense exercise daily or physical job)' }
  ];

  const weightGoals = [
    { value: 'lose', label: 'Lose weight' },
    { value: 'maintain', label: 'Maintain weight' },
    { value: 'gain', label: 'Gain weight' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    console.log('Form submitted:', formData);
    e.preventDefault();
    setLocalLoading(true);
    setError('');

    try {
      // Use the handleApiRequest if provided, otherwise fall back to direct axios call
      if (handleApiRequest) {
        const result = await handleApiRequest(() => 
          axios.post(`${API_URL}/health-data`, formData)
        );
        console.log('API result:', result);
        
        setUserData(result.data.user);
        setMealPlan(result.data.mealPlan);
      } else {
        const response = await axios.post(`${API_URL}/health-data`, formData);
        console.log('API result:', response);
        
        setUserData(response.data.user);
        setMealPlan(response.data.mealPlan);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to process your data. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const renderProgressBar = () => {
    const totalSteps = 3;
    const percentage = (step / totalSteps) * 100;

    return (
      <div className="mb-8">
        <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Basic Info</span>
          <span>Measurements</span>
          <span>Goals</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Your Personalized Diet Plan
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Tell us about yourself to create your custom meal plan
      </p>
      
      {renderProgressBar()}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="age">
                Age
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                placeholder="Enter your age"
                required
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="gender">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['male', 'female', 'other'].map((gender) => (
                  <label 
                    key={gender}
                    className={`
                      flex items-center justify-center px-4 py-3 rounded-lg border
                      cursor-pointer transition
                      ${formData.gender === gender 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="capitalize">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="height">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  id="height"
                  name="height"
                  type="number"
                  min="50"
                  max="250"
                  placeholder="Enter your height"
                  required
                  value={formData.height}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  cm
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="weight">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  id="weight"
                  name="weight"
                  type="number"
                  min="20"
                  max="300"
                  placeholder="Enter your weight"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  kg
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="activityLevel">
                Activity Level
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none bg-white"
                id="activityLevel"
                name="activityLevel"
                required
                value={formData.activityLevel}
                onChange={handleChange}
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="weightGoal">
                Weight Goal
              </label>
              <div className="grid grid-cols-3 gap-4">
                {weightGoals.map(goal => (
                  <label 
                    key={goal.value}
                    className={`
                      flex items-center justify-center px-4 py-3 rounded-lg border
                      cursor-pointer transition text-center
                      ${formData.weightGoal === goal.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="radio"
                      name="weightGoal"
                      value={goal.value}
                      checked={formData.weightGoal === goal.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Create My Plan'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HealthForm;