import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Cars from "@/pages/Cars";
import Contact from "@/pages/Contact ";
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import CarRental from "./pages/carCategories";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once
    });
  }, []);

  const navigate = useNavigate(); // Initialize navigate function

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<About />} />
        <Route
          path="/book"
          element={<CarRental navigate={navigate} />} // Pass navigate prop to CarRental
        />
        <Route path="/services" element={<Services />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
