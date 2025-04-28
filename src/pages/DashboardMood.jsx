import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { LineChart, Calendar, Book, PieChart, Plus, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import MentalNav from '../components/MentalNav';

const DashboardMood = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    journalCount: 0,
    averageMood: 0,
    recentInsights: [],
    activityCompletions: []
  });
  const {  backendUrl,token } = useContext(AppContext);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get journal entries count
        const journalRes = await axios.get(`${backendUrl}/api/journal?limit=1`,{ headers: { utoken: token } });
        
        // Get mood trends
        const moodRes = await axios.get(`${backendUrl}/api/analysis/mood-trends?timeFrame=week`,{ headers: { utoken: token } });
        
        // Get insights
        const insightsRes = await axios.get(`${backendUrl}/api/analysis/insights`,{ headers: { utoken: token } });
        
        // Get therapy plan activity completions (assuming this endpoint exists)
        const activitiesRes = await axios.get(`${backendUrl}/api/therapy-plan/activities`,{ headers: { utoken: token } });
        
        setStats({
          journalCount: journalRes.data.totalEntries,
          averageMood: moodRes.data.stats.average,
          recentInsights: [insightsRes.data?.insights.summary],
          activityCompletions: activitiesRes.data?.activities || []
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Function to determine mood color based on rating
  const getMoodColor = (rating) => {
    if (rating >= 8) return 'text-blue-600';
    if (rating >= 6) return 'text-blue-500';
    if (rating >= 4) return 'text-blue-400';
    if (rating >= 2) return 'text-blue-300';
    return 'text-blue-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl pt-[15vh] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
     
    <MentalNav/>
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Journal Entries Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book size={24} className="text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800">Journal Entries</h3>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-blue-600">{stats.journalCount}</div>
            <Link to="/journal" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Current Mood Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LineChart size={24} className="text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800">Current Mood</h3>
          </div>
          <div className="flex justify-between items-center">
            <div className={`text-3xl font-bold ${getMoodColor(stats.averageMood)}`}>
              {stats.averageMood.toFixed(1)}<span className="text-xl text-gray-400">/10</span>
            </div>
            <Link to="/mood-trends" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              View Trends <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-col space-y-3">
            <Link to="/journal/new" className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
              <Plus size={18} className="mr-2" /> New Journal Entry
            </Link>
            <Link to="/therapy-plans" className="flex items-center justify-center py-2 px-4 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors duration-300">
              <Calendar size={18} className="mr-2" /> View Therapy Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <PieChart size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Insights</h2>
          </div>
          {stats.recentInsights.length > 0 && (
            <Link to="/insights" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
        
        {stats.recentInsights.length > 0 ? (
          <div className="space-y-4">
            {stats.recentInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No insights available yet. Continue journaling to receive personalized insights.</p>
            <Link to="/journal/new" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              Start Journaling <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Weekly Progress Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Activity Progress</h2>
        
        {stats.activityCompletions.length > 0 ? (
          <div className="space-y-4">
            {stats.activityCompletions.slice(0, 3).map((activity, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{activity.name}</span>
                  <span className="text-sm font-medium text-gray-500">{activity.completed}/{activity.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (activity.completed/activity.target)*100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <Link to="/therapy-plans" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              View Complete Plan <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No activities yet. Create a therapy plan to track your progress.</p>
            <Link to="/therapy-plans/new" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              Create Plan <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMood;