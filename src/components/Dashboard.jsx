   import React, { useState } from 'react';
  import axios from 'axios';
  import { 
    Chart as ChartJS, 
    ArcElement, 
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend 
  } from 'chart.js';
  import { Doughnut, Bar } from 'react-chartjs-2';
  import html2pdf from 'html2pdf.js';

  // Register ChartJS components
  ChartJS.register(
    ArcElement, 
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const API_URL = 'http://localhost:5000/api';

  const Dashboard = ({ userData, mealPlan, setMealPlan }) => {
    console.log(userData);
    
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // Added for tab navigation

    // BMI categories and classification
    const getBMICategory = (bmi) => {
      if (bmi < 18.5) return { category: 'Underweight', color: '#FFD700', range: '< 18.5' };
      if (bmi < 25) return { category: 'Normal weight', color: '#4CAF50', range: '18.5 - 24.9' };
      if (bmi < 30) return { category: 'Overweight', color: '#FF9800', range: '25 - 29.9' };
      return { category: 'Obese', color: '#F44336', range: '≥ 30' };
    };

    const bmiInfo = getBMICategory(userData.bmi);

    // Chart data for macronutrient distribution
    const macroChartData = {
      labels: ['Carbs', 'Protein', 'Fats'],
      datasets: [
        {
          data: [mealPlan.totalCarbs, mealPlan.totalProtein, mealPlan.totalFats],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
          hoverBackgroundColor: ['#2563EB', '#059669', '#D97706'],
          borderWidth: 0,
        },
      ],
    };

    // Chart data for calories by meal
    const calorieChartData = {
      labels: ['Breakfast', 'Lunch', 'Dinner'],
      datasets: [
        {
          label: 'Calories',
          data: [
            mealPlan.breakfast.calories,
            mealPlan.lunch.calories,
            mealPlan.dinner.calories,
          ],
          backgroundColor: ['#3B82F6', '#EC4899', '#F59E0B'],
        },
      ],
    };
    
    const calorieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Calorie Distribution by Meal',
          font: {
            size: 16,
          }
        },
      },
    };

    // Handle meal plan regeneration
    const handleRegenerateMealPlan = async () => {
      setIsRegenerating(true);
      setError('');

      try {
        const response = await axios.post(`${API_URL}/regenerate-meal-plan/${userData.id}`);
        setMealPlan(response.data.mealPlan);
      } catch (err) {
        console.error('Error regenerating meal plan:', err);
        setError('Failed to regenerate meal plan. Please try again.');
      } finally {
        setIsRegenerating(false);
      }
    };

    // Handle PDF export
    const exportToPDF = () => {
      const element = document.getElementById('meal-plan-content');
      const opt = {
        margin: 1,
        filename: `diet-plan-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    };

    // Calculate percentage of daily calories for each macronutrient
    const carbsPercent = Math.round((mealPlan.totalCarbs * 4 / mealPlan.totalCalories) * 100);
    const proteinPercent = Math.round((mealPlan.totalProtein * 4 / mealPlan.totalCalories) * 100);
    const fatsPercent = Math.round((mealPlan.totalFats * 9 / mealPlan.totalCalories) * 100);

    // Progress towards calorie goal
    const calorieGoalProgress = Math.min(100, Math.round((mealPlan.totalCalories / userData.dailyCalories) * 100));

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
            <div className="flex">
              <div className="py-1">
                <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>{error}</div>
            </div>
          </div>
        )}
        
        {/* Header with profile summary */}
        <div className="bg-gradient-to-r from-blue-600 mt-16 to-blue-800 rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">Your Nutrition Dashboard</h1>
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-blue-200">Daily Goal</p>
                <p className="text-2xl font-bold">{userData.dailyCalories} kcal</p>
              </div>
              <div>
                <p className="text-blue-200">BMI</p>
                <p className="text-2xl font-bold">{userData.bmi.toFixed(1)}</p>
                <p className="text-sm opacity-90">{bmiInfo.category}</p>
              </div>
              <div>
                <p className="text-blue-200">Weight</p>
                <p className="text-2xl font-bold">{userData.weight} kg</p>
              </div>
              <div>
                <p className="text-blue-200">Goal</p>
                <p className="text-2xl font-bold capitalize">{userData.weightGoal}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg ${
              activeTab === 'overview'
                ? 'bg-white border-l border-t border-r border-gray-200 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('meal-plan')}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg ${
              activeTab === 'meal-plan'
                ? 'bg-white border-l border-t border-r border-gray-200 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Meal Plan
          </button>
        </div>
        
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Health Metrics */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Health Profile</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Age</span>
                    <span className="font-medium">{userData.age} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">{userData.height} cm</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{userData.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">BMI</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{userData.bmi.toFixed(1)}</span>
                      <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: bmiInfo.color, color: '#fff' }}>
                        {bmiInfo.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Activity Level</span>
                    <span className="font-medium capitalize">{userData.activityLevel.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Weight Goal</span>
                    <span className="font-medium capitalize">{userData.weightGoal}</span>
                  </div>
                </div>
              </div>

              {/* BMI Scale */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">BMI Classification</h2>
                </div>
                <div className="p-5">
                  <div className="flex mb-2">
                    <div className="w-1/4 h-3 bg-yellow-400 rounded-l"></div>
                    <div className="w-1/4 h-3 bg-green-500"></div>
                    <div className="w-1/4 h-3 bg-orange-500"></div>
                    <div className="w-1/4 h-3 bg-red-500 rounded-r"></div>
                  </div>
                  <div className="flex text-xs text-gray-600 mt-1">
                    <div className="w-1/4">Underweight<br/>&lt;18.5</div>
                    <div className="w-1/4">Normal<br/>18.5-24.9</div>
                    <div className="w-1/4">Overweight<br/>25-29.9</div>
                    <div className="w-1/4">Obese<br/>≥30</div>
                  </div>
                  
                  {/* BMI Marker */}
                  <div className="relative h-8 mt-3">
                    <div 
                      className="absolute top-0 transform -translate-x-1/2" 
                      style={{ 
                        left: `${Math.min(100, Math.max(0, (userData.bmi / 40) * 100))}%` 
                      }}
                    >
                      <div className="w-3 h-3 bg-blue-600 transform rotate-45"></div>
                      <p className="text-sm font-medium text-blue-600 mt-1">Your BMI: {userData.bmi.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Nutrition Charts */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calorie Progress */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Daily Calories</h2>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-600">{calorieGoalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${calorieGoalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Current</p>
                        <p className="text-2xl font-bold">{mealPlan.totalCalories}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="text-2xl font-bold">{userData.dailyCalories}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-2xl font-bold">{Math.max(0, userData.dailyCalories - mealPlan.totalCalories)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Macronutrient Distribution */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Macronutrients</h2>
                  </div>
                  <div className="p-5">
                    <div className="mb-4 h-36">
                      <Doughnut 
                        data={macroChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          cutout: '70%',
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                boxWidth: 12,
                                padding: 15
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                  const percentage = ((value / total) * 100).toFixed(1);
                                  return `${label}: ${value}g (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="px-2 py-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600">Carbs</p>
                        <p className="text-lg font-bold text-blue-600">{carbsPercent}%</p>
                        <p className="text-xs text-gray-500">{mealPlan.totalCarbs}g</p>
                      </div>
                      <div className="px-2 py-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600">Protein</p>
                        <p className="text-lg font-bold text-green-600">{proteinPercent}%</p>
                        <p className="text-xs text-gray-500">{mealPlan.totalProtein}g</p>
                      </div>
                      <div className="px-2 py-3 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-600">Fats</p>
                        <p className="text-lg font-bold text-yellow-600">{fatsPercent}%</p>
                        <p className="text-xs text-gray-500">{mealPlan.totalFats}g</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Calorie Distribution */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2">
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Meal Calorie Distribution</h2>
                  </div>
                  <div className="p-5">
                    <div className="h-64">
                      <Bar data={calorieChartData} options={calorieChartOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Meal Plan Tab Content */}
        {activeTab === 'meal-plan' && (
          <div id="meal-plan-content" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <h2 className="text-2xl font-bold">Your Personalized Meal Plan</h2>
              <p className="mt-1 text-green-100">Designed to meet your daily calorie target of {userData.dailyCalories} kcal</p>
            </div>
            
            <div className="p-6">
              {/* Daily Totals Summary */}
              <div className="flex flex-wrap justify-between p-5 mb-8 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-center px-4 py-2">
                  <span className="block text-gray-500 text-sm">Total Calories</span>
                  <span className="text-3xl font-bold text-gray-800">{mealPlan.totalCalories}</span>
                  <span className="text-sm text-gray-500">kcal</span>
                </div>
                <div className="text-center px-4 py-2">
                  <span className="block text-gray-500 text-sm">Carbs</span>
                  <span className="text-3xl font-bold text-blue-600">{mealPlan.totalCarbs}</span>
                  <span className="text-sm text-gray-500">g</span>
                </div>
                <div className="text-center px-4 py-2">
                  <span className="block text-gray-500 text-sm">Protein</span>
                  <span className="text-3xl font-bold text-green-600">{mealPlan.totalProtein}</span>
                  <span className="text-sm text-gray-500">g</span>
                </div>
                <div className="text-center px-4 py-2">
                  <span className="block text-gray-500 text-sm">Fats</span>
                  <span className="text-3xl font-bold text-yellow-600">{mealPlan.totalFats}</span>
                  <span className="text-sm text-gray-500">g</span>
                </div>
              </div>
              
              {/* Individual Meals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Breakfast */}
                <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl overflow-hidden shadow-sm border border-blue-100">
                  <div className="px-5 py-4 bg-blue-500 text-white">
                    <h3 className="text-xl font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      Breakfast
                    </h3>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{mealPlan.breakfast.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{mealPlan.breakfast.description}</p>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">Calories</span>
                      </div>
                      <span className="font-medium">{mealPlan.breakfast.calories} kcal</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                        <span className="text-sm">Carbs</span>
                      </div>
                      <span className="font-medium">{mealPlan.breakfast.carbs}g</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Protein</span>
                      </div>
                      <span className="font-medium">{mealPlan.breakfast.protein}g</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Fats</span>
                      </div>
                      <span className="font-medium">{mealPlan.breakfast.fats}g</span>
                    </div>
                  </div>
                </div>
                
                {/* Lunch */}
                <div className="bg-gradient-to-b from-pink-50 to-white rounded-xl overflow-hidden shadow-sm border border-pink-100">
                  <div className="px-5 py-4 bg-pink-500 text-white">
                    <h3 className="text-xl font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Lunch
                    </h3>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{mealPlan.lunch.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{mealPlan.lunch.description}</p>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="text-sm">Calories</span>
                      </div>
                      <span className="font-medium">{mealPlan.lunch.calories} kcal</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                        <span className="text-sm">Carbs</span>
                      </div>
                      <span className="font-medium">{mealPlan.lunch.carbs}g</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Protein</span>
                      </div>
                      <span className="font-medium">{mealPlan.lunch.protein}g</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Fats</span>
                      </div>
                      <span className="font-medium">{mealPlan.lunch.fats}g</span>
                    </div>
                  </div>
                </div>
                
                {/* Dinner */}
                <div className="bg-gradient-to-b from-yellow-50 to-white rounded-xl overflow-hidden shadow-sm border border-yellow-100">
                  <div className="px-5 py-4 bg-yellow-500 text-white">
                    <h3 className="text-xl font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                      </svg>
                      Dinner
                    </h3>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{mealPlan.dinner.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{mealPlan.dinner.description}</p>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Calories</span>
                      </div>
                      <span className="font-medium">{mealPlan.dinner.calories} kcal</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                        <span className="text-sm">Carbs</span>
                      </div>
                      <span className="font-medium">{mealPlan.dinner.carbs}g</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Protein</span>
                      </div>
                      <span className="font-medium">{mealPlan.dinner.protein}g</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Fats</span>
                      </div>
                      <span className="font-medium">{mealPlan.dinner.fats}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={handleRegenerateMealPlan} 
                className={`px-4 py-2 rounded-lg text-white font-semibold ${isRegenerating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300`}
                disabled={isRegenerating}
              >
                {isRegenerating ? 'Regenerating...' : 'Regenerate Meal Plan'}
              </button>
              {/* <button 
                onClick={exportToPDF} 
                className="ml-4 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300"
              >
                Export to PDF
              </button> */}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default Dashboard;
