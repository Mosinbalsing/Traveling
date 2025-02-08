import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowUp } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Cars from "@/pages/Cars";
import CarRental from "./pages/carCategories";
import Contact from "@/pages/Contact ";
import loder from "./assets/loaders/preloader.gif";
import SlidingAuthForm from "./components/LogInSigUp";

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
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
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
      

      {location.pathname !== "/log" && <><Navbar /> <ScrollToTop /></>}
      

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <img src={loder} alt="Loading..." />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<About />} />
        <Route path="/book" element={<CarRental />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/log" element={<SlidingAuthForm />} />
      </Routes>

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
