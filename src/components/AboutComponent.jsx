import { HR } from "flowbite-react";
import { Button } from "@/components/ui/button";

export default function AboutComponent() {
  const LogoImg = "images/bg/1.png"; // Ensure the image path is correct

  return (
    <section className="bg-[#FFFFFF] py-10 md:py-20 overflow-hidden relative">
      {/* Background Image Positioned on the Right */}
      <div
        className="absolute inset-y-0 right-0 w-full md:w-[70%] bg-cover bg-center bg-no-repeat opacity-50 md:opacity-100"
        style={{ backgroundImage: `url(${LogoImg})` }}
      ></div>

      {/* Content Container */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Left Side Text Content */}
        <div className="w-full md:w-1/2 p-4 md:p-6 bg-transparent rounded-lg">
          {/* Rotated "About Us" Heading (Hidden on Small Screens) */}
          <h4 className="md:flex text-[18px] sm:text-[20px] text-[#F1F1F1] font-bold uppercase tracking-widest md:absolute md:left-[-243px] md:rotate-[90deg] md:transform md:origin-right md:mt-44 text-left justify-center gap-2 items-center rotate-0">
            ABOUT US <span className="sm:block hidden w-[50px] h-[1px] bg-orange-500"></span>
          </h4>

          {/* Main Heading */}
          <h2 className="text-[22px] sm:text-[24px] font-sans font-bold text-gray-800 mb-4 text-justify md:text-left">
            WE PROMISE, YOU WILL HAVE THE BEST EXPERIENCE
          </h2>

          {/* Description */}
          <div className="text-gray-600 mt-6 text-sm sm:text-base text-justify leading-relaxed">
            <p className="mb-4">
              In omni memoria patriae religionis sunt diri undead historiarum.
              Golums, zombies et fascinati. Maleficia! Vel a modern perhsaps
              morbi. A terrenti contagium. Forsitan illud Apocalypsi, vel malum
              poenae horrifying fecimus.
            </p>
            <p>
              Ut fames cerebro enim carnis, viscera et organa viventium. Sicut
              spargit virus ad impetum, qui supersumus. Avium, canum, fugere
              ferae et infecti horrenda monstra. Videmus deformis horrenda
              daemonum. Panduntur portae inferi.
            </p>
          </div>

          {/* Book Now Button */}
          <Button className="w-[160px] h-[50px] relative px-[43px] py-[14px] flex items-center leading-[24px] uppercase text-[#ff8201] border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-transparent hover:bg-[#ff8201] hover:text-white mt-6">
            Book Now
          </Button>
        </div>
      </div>
    </section>
  );
}
