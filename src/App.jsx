import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MedimedHome from './pages/MedimedHome'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FindHome from './pages/FindHome'
import Protectedroute from './pages/Protectedroute'
import Doctorsearch from './pages/Doctorsearch'
import RateHospital from './pages/RateHospital'
import RateDoctor from './pages/RateDoctor'
import Doctorreview from './pages/Doctorreview'
import HospitalReview from './pages/Hospitalreview'
import SavedDoctors from './pages/SavedDoctors'
import Myratings from './pages/Myratings'
import UpdateHosRating from './pages/Edit/EdithosRating'
import UpdateDocRating from './pages/Edit/EditdocRating'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />

      <Routes>
      <Route path='/' element={<MedimedHome />} />
      <Route path='/find-doc' element={
          <Protectedroute>
            <FindHome />
          </Protectedroute>
        } />
        <Route path='/search' element={
          <Protectedroute>
            <Doctorsearch/>
          </Protectedroute>
        } />
          <Route path='/myratings' element={
          <Protectedroute>
            <Myratings/>
          </Protectedroute>
        } />
         <Route path='/saved-doctors' element={
          <Protectedroute>
            <SavedDoctors/>
          </Protectedroute>
        } />
        <Route path='/edit-hospitalrating/:id/:reviewId' element={
          <Protectedroute>
            <UpdateHosRating/>
          </Protectedroute>
        } />
         <Route path='/edit-doctorrating/:id/:reviewId' element={
          <Protectedroute>
            <UpdateDocRating/>
          </Protectedroute>
        } />
           <Route path='/:id/hospitalreview' element={
          <Protectedroute>
            <HospitalReview/>
          </Protectedroute>
        } />
        <Route path='/:id/doctorreview' element={
          <Protectedroute>
            <Doctorreview/>
          </Protectedroute>
        } />
        <Route path='/:id/ratedoctor' element={
          <Protectedroute>
            <RateDoctor/>
          </Protectedroute>
        } />
        <Route path='/:id/ratehospital' element={
          <Protectedroute>
            <RateHospital/>
          </Protectedroute>
        } />
      <Route path='/appointment' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='my-profile/' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App