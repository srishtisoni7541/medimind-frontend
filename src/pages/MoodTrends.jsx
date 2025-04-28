import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import MentalNav from '../components/MentalNav';

const MoodTrends = () => {
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    topFactors: []
  });
  const [timeFrame, setTimeFrame] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const { backendUrl,token} = useContext(AppContext);
  useEffect(() => {
    fetchMoodTrends();
  }, [timeFrame]);

  const fetchMoodTrends = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/analysis/mood-trends?timeFrame=${timeFrame}`,{ headers: { utoken: token } });
      
      // Process data to add formatted time
      const processedData = res.data.moodData.map(entry => {
        const date = new Date(entry.date);
        return {
          ...entry,
          formattedDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          formattedTime: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          displayLabel: `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
        };
      });
      
      setMoodData(processedData);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error fetching mood trends:', err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{data.formattedDate} at {data.formattedTime}</p>
          <p className="text-blue-600 font-bold">Mood: {data.mood}/10</p>
          {data.note && <p className="text-gray-600 mt-1">{data.note}</p>}
        </div>
      );
    }
    return null;
  };

  if (loading && moodData.length === 0) {
    return (
      <div className="flex items-center pt-[15vh] justify-center min-h-screen">
        <div className="text-blue-600 text-lg font-medium flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading mood trends...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl pt-[15vh] mx-auto px-4 py-8">
      <MentalNav/>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Mood Trends</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="mr-2 text-gray-700 font-medium">Chart: </label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-gray-700 font-medium">Time Frame: </label>
            <select 
              value={timeFrame} 
              onChange={(e) => setTimeFrame(e.target.value)}
              className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {moodData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl text-blue-200 mb-4">📊</div>
          <p className="text-xl text-gray-700 mb-2">No mood data available for the selected time period.</p>
          <p className="text-gray-500">Start tracking your mood by creating journal entries to see your trends over time.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Mood Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Average Mood</h3>
              <div className="text-4xl font-bold text-blue-600">{stats.average.toFixed(1)}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Highest Mood</h3>
              <div className="text-4xl font-bold text-blue-600">{stats.highest}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Lowest Mood</h3>
              <div className="text-4xl font-bold text-blue-600">{stats.lowest}</div>
            </div>
          </div>
          
          {/* Mood Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Mood Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="displayLabel" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="mood" fill="#3B82F6" />
                  </BarChart>
                ) : (
                  <LineChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="displayLabel" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={{ r: 6, fill: "#3B82F6", strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Mood Factors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Top Factors Affecting Your Mood</h3>
            {stats.topFactors.length > 0 ? (
              <div className="space-y-4">
                {stats.topFactors.map((factor, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/4 text-gray-700 font-medium">{factor.factor}</div>
                    <div className="w-1/2 h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full ${factor.avgImpact > 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(factor.avgImpact) * 20, 100)}%`, marginLeft: factor.avgImpact < 0 ? 'auto' : '0' }}
                      ></div>
                    </div>
                    <div className={`ml-4 font-medium ${factor.avgImpact > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {factor.avgImpact > 0 ? '+' : ''}{factor.avgImpact.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Not enough data to determine mood factors.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTrends;