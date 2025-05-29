"use client"

import { useState, useEffect } from "react"
import { useChecker } from "../context/CheckerContext"
import PreviousButton from "../components/PreviousButton"
import ContinueButton from "../components/ContinueButton"
import { Mic, MicOff, AlertCircle, Loader2 } from "lucide-react"

const SymptomsPage = () => {
  const { userData, updateUserData, nextTab } = useChecker()
  const [symptoms, setSymptoms] = useState(userData.symptoms || "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [followUpQuestions, setFollowUpQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [followUpAnswers, setFollowUpAnswers] = useState({})
  const [showFollowUp, setShowFollowUp] = useState(false)

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setSymptoms((prev) => {
          // Only update if the new transcript is different to avoid state loops
          return transcript !== prev ? transcript : prev
        })
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        setError("Speech recognition failed. Please try again or type your symptoms.")
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      setError("Speech recognition is not supported in your browser.")
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      // Clear error if there was one
      setError("")
      recognition.start()
      setIsListening(true)
    }
  }

  const fetchFollowUpQuestions = async () => {
    if (!symptoms.trim()) {
      setError("Please enter your symptoms")
      return false
    }

    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/gemini/follow-up-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: userData.age,
          sex: userData.sex,
          symptoms,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get follow-up questions")
      }

      const data = await response.json()

      if (data.questions && Array.isArray(data.questions)) {
        setFollowUpQuestions(data.questions)
        setCurrentQuestionIndex(0)
        setShowFollowUp(true)
        setIsProcessing(false)
        return true
      } else {
        throw new Error("Invalid data format for follow-up questions")
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to get follow-up questions. Please try again.")
      setIsProcessing(false)
      return false
    }
  }

  const handleAnswerChange = (answer) => {
    setFollowUpAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < followUpQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleFinalSubmit()
    }
  }

  const handleFinalSubmit = async () => {
    setIsProcessing(true)
    
    // Prepare all the data for analysis
    const formattedAnswers = followUpQuestions.map((question, index) => ({
      question,
      answer: followUpAnswers[index] || "No answer provided"
    }))
    
    try {
      const response = await fetch("http://localhost:5000/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: userData.age,
          sex: userData.sex,
          symptoms,
          followUpAnswers: formattedAnswers
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to analyze symptoms")
      }

      const data = await response.json()

      if (data.conditions) {
        updateUserData({ 
          symptoms,
          followUpAnswers: formattedAnswers,
          conditions: data.conditions 
        })
        setIsProcessing(false)
        // Add this line to navigate to the next tab
        nextTab()
        return true
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to analyze symptoms. Please try again.")
      setIsProcessing(false)
      return false
    }
  }

  const handleInitialContinue = () => {
    if (!symptoms.trim()) {
      setError("Please enter your symptoms")
      return
    }
    
    fetchFollowUpQuestions()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Age:</span>
          <span className="text-lg font-semibold text-gray-800">{userData.age}</span>
        </div>
        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Sex:</span>
          <span className="text-lg font-semibold text-gray-800">{userData.sex}</span>
        </div>
      </div>

      {/* Main Form Card */}
      {!showFollowUp ? (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">What symptoms are you experiencing?</h2>
          <p className="text-gray-600 mb-6">
            Please describe your symptoms in detail, including when they started, their severity, and any other relevant
            information.
          </p>

          <div className="relative mb-6">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I've had a headache for the past 3 days, along with a fever of 101°F and a sore throat..."
              rows={6}
              className={`w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 transition duration-200 resize-none
                ${error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-teal-200"} 
                ${isListening ? "border-teal-400 bg-teal-50" : "border"}`}
            />

            <button
              type="button"
              onClick={toggleListening}
              className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all duration-200 flex items-center justify-center
                ${
                  isListening ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              title={isListening ? "Stop recording" : "Start voice input"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {isListening && (
            <div className="flex items-center gap-2 text-teal-600 mb-4 p-3 bg-teal-50 rounded-lg animate-pulse">
              <div className="relative">
                <div className="w-2 h-2 bg-teal-500 rounded-full absolute animate-ping"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full relative"></div>
              </div>
              <span className="font-medium">Listening... Speak now</span>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <PreviousButton className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2" />
            <button
              onClick={handleInitialContinue}
              disabled={isProcessing || !symptoms.trim()}
              className={`px-6 py-2.5 rounded-lg transition duration-200 flex items-center gap-2
                ${
                  isProcessing || !symptoms.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Additional Information</h2>
          <p className="text-gray-600 mb-6">
            Please answer the following questions to help us better understand your condition:
          </p>

          {currentQuestionIndex < followUpQuestions.length && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Question {currentQuestionIndex + 1} of {followUpQuestions.length}
              </h3>
              <p className="text-gray-700 mb-4">{followUpQuestions[currentQuestionIndex]}</p>
              
              <textarea
                value={followUpAnswers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Your answer..."
                rows={4}
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 resize-none"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1)
                } else {
                  setShowFollowUp(false)
                }
              }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
            >
              Back
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={isProcessing || !followUpAnswers[currentQuestionIndex]}
              className={`px-6 py-2.5 rounded-lg transition duration-200 flex items-center gap-2
                ${
                  isProcessing || !followUpAnswers[currentQuestionIndex]
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                currentQuestionIndex < followUpQuestions.length - 1 ? "Next Question" : "Submit"
              )}
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <Loader2 size={36} className="text-teal-500 animate-spin mb-4" />
            <p className="text-gray-800 font-medium">
              {showFollowUp ? "Processing your answers..." : "Analyzing your symptoms..."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SymptomsPage