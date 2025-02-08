import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Cars from "@/pages/Cars";
import CarRental from "./pages/carCategories";
import Contact from "@/pages/Contact ";
import loder from "./assets/loaders/preloader.gif";
import SlidingAuthForm from "./components/LogInSigUp";

function App() {
  const location = useLocation(); // Get current route
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate page load time

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [location.pathname]); // Run effect when path changes

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/log" && <Navbar />}
      
      {/* Loader - Show when page is changing */}
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
    </>
  );
}

export default App;
