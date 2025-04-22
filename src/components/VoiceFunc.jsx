import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchHospitals } from "../store/actions/hospitalaction";
import { searchDoctors } from "../store/actions/doctoraction";

const VoiceFunc = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Route mapping object - maps voice commands to routes
  const routeCommands = {
    "go home": "/",
    "home page": "/",
    "find doctor": "/find-doc",
    "search doctor": "/search?doctorName=",
    "search hospital": "/search?hospitalName=",
    "my ratings": "/myratings",
    "saved doctors": "/saved-doctors",
    "appointment": "/my-appointment",
    "doctors": "/doctors",
    "login": "/login",
    "about": "/about",
    "contact": "/contact",
    "my profile": "/my-profile",
    "my appointments": "/my-appointments",
    "symptom checker": "/symptom-checker",
    "health plan": "/health-plan",
    "health dashboard": "/health-dashboard",
    "medication search": "/medication-search"
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep listening after processing results
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setFeedback("Voice commands active - listening continuously");
      };
      
      recognitionRef.current.onresult = (event) => {
        const resultIndex = event.resultIndex;
        const command = event.results[resultIndex][0].transcript.toLowerCase().trim();
        setTranscript(command);
        
        // Process command
        processVoiceCommand(command);
        
        // Visual feedback clears after 3 seconds
        setTimeout(() => {
          setTranscript("");
          setFeedback("Voice commands active - listening continuously");
        }, 3000);
      };
      
      recognitionRef.current.onerror = (event) => {
        setFeedback(`Error: ${event.error}`);
        if (event.error === 'no-speech') {
          // Don't stop listening on no-speech error
          setFeedback("No speech detected, still listening...");
        } else {
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
        // Restart recognition if it's still supposed to be active
        if (isListening) {
          recognitionRef.current.start();
          setFeedback("Restarting voice recognition...");
        } else {
          setFeedback("");
        }
      };
    } else {
      setFeedback("Speech recognition not supported in this browser.");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Start/stop recognition when isListening changes
  useEffect(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isListening]);
  
  const processVoiceCommand = (command) => {
    // System commands
    if (command.includes("stop listening") || command.includes("turn off voice")) {
      setFeedback("Voice commands deactivated");
      setIsListening(false);
      return;
    }

    // Search commands
    if (command.includes("search for doctor") || command.includes("find doctor named")) {
      const nameMatch = command.match(/doctor\s+named\s+(\w+)/i) || 
                        command.match(/search\s+for\s+doctor\s+(\w+)/i) ||
                        command.match(/find\s+doctor\s+(\w+)/i);
      
      if (nameMatch && nameMatch[1]) {
        const doctorName = nameMatch[1];
        setFeedback(`Searching for doctor: ${doctorName}...`);
        navigate(`/search?doctorName=${doctorName}`);
        return;
      }
    }
    
    if (command.includes("search for hospital") || command.includes("find hospital named")) {
      const nameMatch = command.match(/hospital\s+named\s+(\w+)/i) || 
                        command.match(/search\s+for\s+hospital\s+(\w+)/i) ||
                        command.match(/find\s+hospital\s+(\w+)/i);
      
      if (nameMatch && nameMatch[1]) {
        const hospitalName = nameMatch[1];
        setFeedback(`Searching for hospital: ${hospitalName}...`);
        navigate(`/search?hospitalName=${hospitalName}`);
        return;
      }
    }

    // Book appointment command - detected on doctor profile page
    if ((command.includes("book appointment") || command.includes("schedule appointment")) && 
        location.pathname.includes("/doctorreview")) {
      const doctorId = location.pathname.split('/')[1];
      setFeedback(`Navigating to book appointment...`);
      navigate(`/appointment/${doctorId}`);
      return;
    }

    // Check for navigation commands
    for (const [phrase, route] of Object.entries(routeCommands)) {
      if (command.includes(phrase)) {
        setFeedback(`Navigating to ${phrase}...`);
        navigate(route);
        return;
      }
    }
    
    // Special commands for specific routes with parameters
    if (command.includes("doctor specialty") || command.includes("find specialty")) {
      const specialtyMatch = command.match(/specialty\s+(\w+)/i);
      if (specialtyMatch && specialtyMatch[1]) {
        const specialty = specialtyMatch[1].toLowerCase();
        setFeedback(`Searching for ${specialty} doctors...`);
        navigate(`/doctors/${specialty}`);
        return;
      }
    }
    
    // No matching command found
    setFeedback(`Command not recognized: "${command}"`);
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={toggleListening}
        className={`p-3 rounded-full shadow-lg flex items-center justify-center ${
          isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`}
        aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
          />
        </svg>
      </button>
      
      {feedback && (
        <div className="mt-2 p-2 bg-gray-800 text-white rounded-lg shadow-lg text-sm">
          {feedback}
        </div>
      )}
      
      {transcript && (
        <div className="mt-2 p-2 bg-gray-100 rounded-lg shadow-lg text-sm max-w-xs">
          <p className="font-semibold">You said:</p>
          <p className="text-gray-700">"{transcript}"</p>
        </div>
      )}
      
      {isListening && (
        <div className="absolute top-0 right-0 w-3 h-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
      )}
      
      {/* Helper tooltip */}
      <div className="absolute bottom-16 right-0 bg-white p-3 rounded-lg shadow-lg text-sm w-64 hidden group-hover:block">
        <p className="font-bold mb-1">Voice Commands:</p>
        <ul className="text-xs space-y-1">
          <li>"Search for doctor [name]"</li>
          <li>"Search for hospital [name]"</li>
          <li>"Book appointment" (on doctor page)</li>
          <li>"Find doctor specialty [specialty]"</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceFunc;