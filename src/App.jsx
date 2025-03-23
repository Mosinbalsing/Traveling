import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
const Contact = lazy(() => import("./pages/Contact "));
const SlidingAuthForm = lazy(() => import("./components/LogInSigUp"));
const BookingSuccess = lazy(() => import("@/pages/BookingSuccess"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [userData, setUserData] = useState(null);

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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return; // No token, no need to fetch user data
      }

      try {
        const data = await authAPI.getUserData(token);
        if (!data) {
          throw new Error("User data not found");
        }
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Redirecting to home.");
        navigate("/log");
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <img src={loder} alt="Loading..." />
      </div>
    );
  }

  return (
    <div>
      {location.pathname !== "/log" && 
       location.pathname !== "/admin/login" && 
       location.pathname !== "/admin/dashboard" && (
        <>
          <Navbar />
          <ScrollToTop />
        </>
      )}

      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <img src={loder} alt="Loading..." />
      </div>}>
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
          <Route 
            path="/booking-success" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <BookingSuccess />
              </Suspense>
            } 
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              </Suspense>
            } 
          />
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

      {/* WhatsApp Button */}
      {location.pathname !== "/log" && (
        <a
          href="https://wa.me/919730260479"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed right-5 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 ${
            showButton ? "bottom-20" : "bottom-5"
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

// Add a Protected Route component for admin routes
const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
        const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

        console.log("Auth Check:", { isAuthenticated, isLoggedIn });

        if (!isAuthenticated || !isLoggedIn) {
          throw new Error("Not authenticated");
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        // Use window.location for hard redirect
        window.location.href = "/admin/login";
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default App;
