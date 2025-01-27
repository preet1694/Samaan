import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { SenderDashboard } from './pages/SenderDashboard';
import { CarrierDashboard } from './pages/CarrierDashboard';
import { SearchCarrier } from './pages/SearchCarrier';
import { CarrierDetails } from './pages/CarrierDetails';
import { SenderDetails } from './pages/SenderDetails';
import { Wallet } from './pages/Wallet';
import { Profile } from './pages/Profile';
import { Hero } from './components/Hero';
import  Footer  from './components/Footer';
import HowItWorks from './components/HowItWorks'; // Import HowItWorks component

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-purple-300 via-teal-200 to-green-200 flex-grow p-10">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <div className="mt-16"> {/* Add margin-top here to create the gap */}
                <HowItWorks /> {/* Add HowItWorks component here */}
              </div>
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sender/dashboard" element={
            <>
              <Navbar />
              <SenderDashboard />
            </>
          } />
          <Route path="/carrier/dashboard" element={
            <>
              <Navbar />
              <CarrierDashboard />
            </>
          } />
          <Route path="/search-carrier" element={
            <>
              <Navbar />
              <SearchCarrier />
            </>
          } />
          <Route path="/carrier/:id" element={
            <>
              <Navbar />
              <CarrierDetails />
            </>
          } />
          <Route path="/sender/:id" element={
            <>
              <Navbar />
              <SenderDetails />
            </>
          } />
          <Route path="/wallet" element={
            <>
              <Navbar />
              <Wallet />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
              <Profile />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
