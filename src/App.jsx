import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import loder from "@/assets/loaders/preloader.gif";
import { authAPI } from "@/config/api";

import BookingConfirmation from "@/pages/BookingConfirmation";
import UserProfile from "@/pages/UserProfile";


// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Cars = lazy(() => import("@/pages/Cars"));
const CarRental = lazy(() => import("./pages/carCategories"));
const Contact = lazy(() => import("@/pages/Contact "));
const SlidingAuthForm = lazy(() => import("./components/LogInSigUp"));
const BookingSuccess = lazy(() => import("@/pages/BookingSuccess"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await authAPI.getUserData(token);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white z-50"><img src={loder} alt="Loading..." /></div>;
  }

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  return (
    <div>
      {location.pathname !== "/log" && location.pathname !== "/booking-success" && (
        <>
          <Navbar />
          <ScrollToTop />
        </>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <img src={loder} alt="Loading..." />
        </div>
      )}

      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-white z-50"><img src={loder} alt="Loading..." /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<About />} />
          <Route path="/book" element={<CarRental />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/log" element={<SlidingAuthForm />} />
          <Route path="/profile" element={<UserProfile userData={userData} />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation userData={userData} />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* WhatsApp Button - Position changes based on Back to Top button visibility */}
      {location.pathname !== "/log" && (
        <a
          href="https://wa.me/919730260479"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed right-5 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 ${
            showButton ? 'bottom-20' : 'bottom-5'
          }`}
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={20} />
        </a>
      )}

      {/* Back to Top Button */}
      {showButton && location.pathname !== "/log" && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all z-50"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

export default App;
