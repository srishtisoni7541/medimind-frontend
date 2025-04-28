import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import MentalNav from '../components/MentalNav';
const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { backendUrl,token } = useContext(AppContext);
  useEffect(() => {
    fetchEntries();
  }, [page]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/journal?page=${page}&limit=10`,{ headers: { utoken: token } });
      setEntries(res.data.entries);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading journal entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl pt-[15vh] mx-auto px-4 py-8">
      <MentalNav/>
      <div className="flex justify-between items-center mb-8 border-b border-blue-200 pb-4">
        <h1 className="text-3xl font-bold text-blue-800">My Journal</h1>
        <Link 
          to="/journal/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Entry
        </Link>
      </div>
      
      {entries.length === 0 ? (
        <div className="bg-blue-50 rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-lg text-blue-800 mb-4">You haven't created any journal entries yet.</p>
          <Link 
            to="/journal/new" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Write Your First Entry
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map(entry => (
              <Link 
                to={`/journal/${entry._id}`} 
                key={entry._id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 border border-blue-100 flex flex-col h-full"
              >
                <div className="p-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <h3 className="text-xl font-semibold truncate">{entry.title}</h3>
                  <span className="text-sm text-blue-100">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="p-5 flex-grow">
                  <p className="text-gray-700 line-clamp-3">
                    {entry.content.substring(0, 150)}
                    {entry.content.length > 150 ? '...' : ''}
                  </p>
                </div>
                <div className="px-5 pb-4 pt-2 border-t border-blue-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                        Mood: {entry.mood}/10
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {entry.emotions.slice(0, 3).map((emotion, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {emotion}
                        </span>
                      ))}
                      {entry.emotions.length > 3 && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          +{entry.emotions.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className={`flex items-center py-2 px-4 rounded-md transition ${
                  page === 1 
                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-md font-medium">
                Page {page} of {totalPages}
              </div>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
                className={`flex items-center py-2 px-4 rounded-md transition ${
                  page === totalPages 
                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Journal;