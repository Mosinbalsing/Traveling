import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ImFacebook } from "react-icons/im";
import { FaInstagram } from "react-icons/fa6";
import { LiaGoogle } from "react-icons/lia";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800 });

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#222222] h-[100px] w-full flex justify-center">
        <div className="w-full md:w-[80%] h-[50px] mt-3 flex justify-between items-start px-4 md:px-0">
          <div className="flex gap-4 icons">
            <ImFacebook className="text-white text-[17px] hover:text-[#FF8201]" />
            <FaInstagram className="text-white text-[17px] hover:text-[#FF8201]" />
            <LiaGoogle className="text-white text-[17px] hover:text-[#FF8201]" />
          </div>
          <div className="contacts flex gap-4 md:gap-10 justify-center">
            <div className="phone flex gap-3 items-center">
              <FiPhone className="text-white" />
              <p className="text-white text-sm md:text-base">+091 234 5678</p>
            </div>
            <div className="phone flex gap-3 items-center">
              <MdOutlineMailOutline className="text-white" />
              <p className="text-white text-sm md:text-base">
                info@carhire.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="w-full flex justify-center items-center">
        <nav
          className={`h-[100px] w-full z-10 shadow-lg flex justify-between md:justify-around items-center transition-all duration-500 ease-in-out ${
            location.pathname === "/"
              ? "bg-white text-gray-600 md:w-[900px] md:rounded-[50px] mt-[-55px]"
              : "bg-white text-gray-600 w-full fixed top-0 left-0"
          }`}
          data-aos={isFixed ? "fade-down" : ""}
        >
          {/* Logo */}
          <div className="w-48 h-full flex items-center pl-4 md:pl-0">
            <img src="images/logo.png" alt="Logo" className="h-12" />
          </div>

          {/* Hamburger Menu Icon (Mobile Only) */}
          <div className="md:hidden flex items-center pr-4">
            <button onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <FaTimes className="text-2xl text-gray-600" />
              ) : (
                <FaBars className="text-2xl text-gray-600" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex gap-12 h-full w-auto items-center font-bold text-gray-600 justify-around">
            {[
              { name: "Home", path: "/" },
              { name: "Booking", path: "/booking" },
              { name: "Services", path: "/services" },
              { name: "Cars", path: "/cars" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`cursor-pointer transition-colors duration-300 ${
                    location.pathname === item.path
                      ? "text-[#FF8201]"
                      : "text-gray-600 hover:text-[#FF8201]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar for Mobile and Tablet */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 w-[70%] md:w-64 bg-white z-30 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-6 p-6 font-bold text-gray-600">
          {[
            { name: "Home", path: "/" },
            { name: "Booking", path: "/booking" },
            { name: "Services", path: "/services" },
            { name: "Cars", path: "/cars" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`cursor-pointer transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-[#FF8201]"
                    : "text-gray-600 hover:text-[#FF8201]"
                }`}
                onClick={toggleSidebar}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
