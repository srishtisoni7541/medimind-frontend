import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import MentalNav from '../components/MentalNav';

const EMOTIONS = [
  'happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 
  'stressed', 'content', 'frustrated', 'hopeful', 'tired', 'grateful'
];

const ACTIVITIES = [
  'work', 'exercise', 'family', 'friends', 'hobbies', 'meditation',
  'sleep', 'reading', 'travel', 'cooking', 'cleaning', 'shopping'
];

const JournalEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewEntry = !id;
  const { backendUrl,token} = useContext(AppContext);
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 5,
    emotions: [],
    activities: [],
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEntry();
    }
  }, [id]);

  const fetchEntry = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/journal/${id}`,{ headers: { utoken: token } });
      setFormData(res.data.entry);
      if (res.data.entry.aiAnalysis) {
        setAnalysis(res.data.entry.aiAnalysis);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching journal entry:', err);
      navigate('/journal');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmotionToggle = (emotion) => {
    setFormData(prev => {
      if (prev.emotions.includes(emotion)) {
        return { ...prev, emotions: prev.emotions.filter(e => e !== emotion) };
      } else {
        return { ...prev, emotions: [...prev.emotions, emotion] };
      }
    });
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => {
      if (prev.activities.includes(activity)) {
        return { ...prev, activities: prev.activities.filter(a => a !== activity) };
      } else {
        return { ...prev, activities: [...prev.activities, activity] };
      }
    });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isNewEntry) {
        const res = await axios.post(`${backendUrl}/api/journal`, formData,{ headers: { utoken: token } });
        setAnalysis(res.data.analysis);
        navigate(`/journal/${res.data.entry._id}`,{ headers: { utoken: token } });
      } else {
        const res = await axios.put(`${backendUrl}/api/journal/${id}`, formData,{ headers: { utoken: token } });
        setAnalysis(res.data.entry.aiAnalysis);
      }
    } catch (err) {
      console.error('Error saving journal entry:', err);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await axios.delete(`${backendUrl}/api/journal/${id}`,{ headers: { utoken: token } });
        navigate('/journal');
      } catch (err) {
        console.error('Error deleting journal entry:', err);
        alert('Failed to delete journal entry. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading entry...</p>
        </div>
      </div>
    );
  }

  // Get mood emoji based on the mood value
  const getMoodEmoji = (mood) => {
    if (mood <= 3) return '😔';
    if (mood <= 5) return '😐';
    if (mood <= 7) return '🙂';
    return '😄';
  };

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 py-8">
      <MentalNav/>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{isNewEntry ? 'New Journal Entry' : 'Edit Journal Entry'}</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your entry a title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Journal Entry</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="What's on your mind today?"
                rows={10}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
                Mood (1-10)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="mood"
                  name="mood"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={handleChange}
                  className="w-full h-2 bg-blue-100 rounded-md appearance-none cursor-pointer"
                />
                <div className="ml-4 min-w-12 px-3 py-1 bg-blue-50 rounded-full text-center">
                  <span className="text-xl mr-1">{getMoodEmoji(formData.mood)}</span>
                  <span className="font-medium text-blue-700">{formData.mood}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Emotions (select all that apply)</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {EMOTIONS.map(emotion => (
                  <button
                    type="button"
                    key={emotion}
                    onClick={() => handleEmotionToggle(emotion)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                      formData.emotions.includes(emotion)
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Activities (select all that apply)</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {ACTIVITIES.map(activity => (
                  <button
                    type="button"
                    key={activity}
                    onClick={() => handleActivityToggle(activity)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                      formData.activities.includes(activity)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.length > 0 ? (
                  formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                      #{tag}
                      <button 
                        type="button" 
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags added yet</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Entry'}
              </button>
              
              {!isNewEntry && (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
                >
                  Delete Entry
                </button>
              )}
            </div>
          </form>
        </div>
        
        {analysis && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-100 px-6 py-4 border-b border-blue-200">
              <h2 className="text-xl font-bold text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Insights
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {analysis.mainThemes && (
                <div>
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Main Themes</h3>
                  <ul className="space-y-1">
                    {analysis.mainThemes.map((theme, i) => (
                      <li key={i} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{theme}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.sentimentAnalysis && (
                <div>
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Sentiment Analysis</h3>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{analysis.sentimentAnalysis}</p>
                </div>
              )}
              
              {analysis.suggestions && (
                <div>
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Suggestions</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">
                  Analysis generated on {new Date(analysis.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalEntry;