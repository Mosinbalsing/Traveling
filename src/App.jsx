import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowUp } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import loder from "./assets/loaders/preloader.gif";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Cars = lazy(() => import("@/pages/Cars"));
const CarRental = lazy(() => import("./pages/carCategories"));
const Contact = lazy(() => import("@/pages/Contact "));
const SlidingAuthForm = lazy(() => import("./components/LogInSigUp"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);

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

  return (
    <>
      {location.pathname !== "/log" && (
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

        </Routes>
      </Suspense>

      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}

export default App;
