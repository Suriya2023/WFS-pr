import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Component/Home/Home";
import About from "./Component/Navbar/About/About";
import Contact from "./Component/Navbar/Contact/Contact";
import Blogs from "./Component/Navbar/Blogs/Blogs";
import Franchise from "./Component/Navbar/FranchiseSection/Franchise";
import Tracking from "./Component/Navbar/Tracking";
import Login from "./Component/Navbar/AuthLayout/Login";
import ResetPassword from "./Component/Navbar/AuthLayout/ResetPassword";
import SignupForm from "./Component/Navbar/AuthLayout/SignupForm";
import OtpVerify from "./Component/Navbar/AuthLayout/OtpVerify";
import MySShip from "./Component/Navbar/Dashboard-Layout/FinalDashConntrole";
import BarcodeScanner from './Component/BarcodeScanner';
import EmauilVarified from './Component/EmailVarified/EmauilVarified'
import ProtectedRoute from "./Component/Navbar/AuthLayout/ProtectedRoute";
import PaymentSuccess from "./Component/Payment/PaymentSuccess";
import PaymentFailure from "./Component/Payment/PaymentFailure";

import { Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const hideLaout = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/reset-password" || location.pathname.includes("/home");

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!hideLaout && <Navbar />}

      <Routes>
        {/* Public Routes (Accessible by everyone, but Login/Register/Landing redirect to Home if logged in) */}
        <Route path="/" element={!token ? <Home /> : <Navigate to="/home" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/tracking" element={<Tracking />} />

        {/* Auth Routes - Redirect to Home if already logged in */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!token ? <SignupForm /> : <Navigate to="/home" />} />
        <Route path="/reset-password" element={!token ? <ResetPassword /> : <Navigate to="/home" />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/scanner" element={<BarcodeScanner />} />
        {/* <Route path="/users/:id/verify/:token" element={<EmauilVarified />} /> */}

        {/* Payment Response Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<MySShip />} />
        </Route>

      </Routes>

      {!hideLaout && <Footer />}
    </>
  );
}

export default App;
