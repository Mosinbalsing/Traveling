import { IoIosArrowForward } from "react-icons/io";

export default function ContactUs() {
  return (
    <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75"
        style={{ backgroundImage: "url('images/3.jpg')" }}
      ></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 sm:space-y-4 bg-black/30 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">CONTACT US</h1>

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className=" bgt absolute bottom-4 px-3 py-1 sm:px-4 sm:py-2 flex items-center space-x-2 h-[50px] text-xs sm:text-sm md:text-base bg-transparent/2 backdrop-blur justify-center"
        >
          <a href="/" className="text-white hover:text-orange-500 font-sans">
            HOME
          </a>
          <span className="text-white">
            <IoIosArrowForward />
          </span>
          <span className="text-white hover:text-orange-500 font-sans">CONTACT US</span>
        </nav>
      </div>
    </div>
  );
}
