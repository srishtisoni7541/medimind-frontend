import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MedimedHome from "./pages/MedimedHome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FindHome from "./pages/FindHome";
import Protectedroute from "./pages/Protectedroute";
import Doctorsearch from "./pages/Doctorsearch";
import RateHospital from "./pages/RateHospital";
import RateDoctor from "./pages/RateDoctor";
import Doctorreview from "./pages/Doctorreview";
import HospitalReview from "./pages/Hospitalreview";
import SavedDoctors from "./pages/SavedDoctors";
import Myratings from "./pages/Myratings";
import UpdateHosRating from "./pages/Edit/EdithosRating";
import UpdateDocRating from "./pages/Edit/EditdocRating";
import Header from "./components/Header";
import HealthForm from "./components/HealthForm";
import Dashboard from "./components/Dashboard";
import VoiceControl from "./components/VoiceFunc"; // Import VoiceControl component

import { CheckerProvider } from "./context/CheckerContext";
import NavTabs from "./components/NavTabs";
import InfoPage from "./pages/InfoPage";
import SymptomsPage from "./pages/SymptomsPage";
import ConditionsPage from "./pages/ConditionsPage";
import DetailsPage from "./pages/DetailsPage";
import TreatmentPage from "./pages/TreatmentPage";
import { useChecker } from "./context/CheckerContext";
import HeaderSym from "./components/HeaderSym";
import HomeAimedi from "./pages/HomeAimedi";
import MedicationDetailPage from "./pages/MedicationDetailPage";
import PrescriptionsLists from "./pages/PrescriptionLists";
import PrescriptionDetail from "./pages/PrescriptionDetail";
import DonorRegistration from "./pages/DonorRegistration";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfileEdit from "./pages/DonorProfileEdit";
import DonationRequests from "./pages/DonationRequests";
import DonationRequestDetails from "./pages/DonationRequestDetails";
import DashboardMood from './pages/DashboardMood';
import Journal from './pages/Journal';
import JournalEntry from './pages/JournalEntry';
import MoodTrends from './pages/MoodTrends';
import Insights from './pages/Insights';
import TherapyPlans from './pages/TherapyPlans';
const SymptomChecker = () => {
  const { currentTab } = useChecker();

  const renderCurrentPage = () => {
    switch (currentTab) {
      case "info":
        return <InfoPage />;
      case "symptoms":
        return <SymptomsPage />;
      case "conditions":
        return <ConditionsPage />;
      case "details":
        return <DetailsPage />;
      case "treatment":
        return <TreatmentPage />;
      default:
        return <InfoPage />;
    }
  };

  return (
    <div className="symptom-checker">
      <HeaderSym />
      <NavTabs />
      <div className="page-container">{renderCurrentPage()}</div>
    </div>
  );
};

const App = () => {
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle API loading states globally
  const handleApiRequest = async (apiCall) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred with the API request");
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-auto my-4 max-w-4xl">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <Routes>
        <Route path="/" element={<MedimedHome />} />
        <Route
          path="/find-doc"
          element={
            <Protectedroute>
              <FindHome />
            </Protectedroute>
          }
        />
        <Route
          path="/search"
          element={
            <Protectedroute>
              <Doctorsearch />
            </Protectedroute>
          }
        />
        <Route
          path="/myratings"
          element={
            <Protectedroute>
              <Myratings />
            </Protectedroute>
          }
        />
        <Route
          path="/saved-doctors"
          element={
            <Protectedroute>
              <SavedDoctors />
            </Protectedroute>
          }
        />
        <Route
          path="/edit-hospitalrating/:id/:reviewId"
          element={
            <Protectedroute>
              <UpdateHosRating />
            </Protectedroute>
          }
        />
        <Route
          path="/edit-doctorrating/:id/:reviewId"
          element={
            <Protectedroute>
              <UpdateDocRating />
            </Protectedroute>
          }
        />
        <Route
          path="/:id/hospitalreview"
          element={
            <Protectedroute>
              <HospitalReview />
            </Protectedroute>
          }
        />
        <Route
          path="/:id/doctorreview"
          element={
            <Protectedroute>
              <Doctorreview />
            </Protectedroute>
          }
        />
        <Route
          path="/:id/ratedoctor"
          element={
            <Protectedroute>
              <RateDoctor />
            </Protectedroute>
          }
        />
        <Route
          path="/:id/ratehospital"
          element={
            <Protectedroute>
              <RateHospital />
            </Protectedroute>
          }
        />
        <Route path="/medication-search" element={<HomeAimedi />} />
        <Route path="/medication/:name" element={<MedicationDetailPage />} />
        <Route
          path="/doctors"
          element={
            <Protectedroute>
              <Doctors />
            </Protectedroute>
          }
        />
        <Route
          path="/doctors/:speciality"
          element={
            <Protectedroute>
              <Doctors />
            </Protectedroute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/donor-register" element={<DonorRegistration />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/donor-profile-edit" element={<DonorProfileEdit />} />
        <Route path="/donation-requests" element={<DonationRequests />} />
        <Route
          path="/donation-request/:requestId/:hospitalId"
          element={<DonationRequestDetails />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="my-profile/" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/prescriptions" element={<PrescriptionsLists />} />
        <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
        {/* moodtracker */}
        <Route
          path="/dashboard-mood"
          element={
              <DashboardMood />
          }
        />
        <Route
          path="/journal"
          element={
              <Journal />
          }
        />
        <Route
          path="/journal/new"
          element={
              <JournalEntry />
          }
        />
        <Route
          path="/journal/:id"
          element={
              <JournalEntry />
          }
        />
        <Route
          path="/mood-trends"
          element={
              <MoodTrends />
          }
        />
        <Route
          path="/insights"
          element={
              <Insights />
          }
        />
        <Route
          path="/therapy-plans"
          element={
              <TherapyPlans />
          }
        />
        <Route
          path="/symptom-checker"
          element={
            <CheckerProvider>
              <SymptomChecker />
            </CheckerProvider>
          }
        />

        {/* New health plan routes */}
        <Route
          path="/health-plan"
          element={
            userData ? (
              <Navigate to="/health-dashboard" />
            ) : (
              <div className="container mx-auto px-4 py-8">
                <HealthForm
                  setUserData={setUserData}
                  setMealPlan={setMealPlan}
                  handleApiRequest={handleApiRequest}
                  isLoading={isLoading}
                />
              </div>
            )
          }
        />
        <Route
          path="/health-dashboard"
          element={
            userData ? (
              <div className="container mx-auto px-4 py-8">
                <Dashboard
                  userData={userData}
                  mealPlan={mealPlan}
                  setMealPlan={setMealPlan}
                  handleApiRequest={handleApiRequest}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <Navigate to="/health-plan" />
            )
          }
        />
      </Routes>

      {/* Add Voice Control Component */}
      <VoiceControl />
      <Footer />
    </div>
  );
};

export default App;
