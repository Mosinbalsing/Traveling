import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "assets/images/main-slider/image-1.jpg",
    title:
      "Best Worldwide <br /><span class='text-orange-500'>Car Hire</span> Deals",
    text: "Tremor est vivos magna. Expansis ulnis video missing <br/>carnem armis caeruleum in locis.",
    button: "EXPLORE NOW",
    leftAligned: true,
  },
  {
    id: 2,
    image: "assets/images/main-slider/image-2.jpg",
    title: "NEED A <span class='text-orange-500'>RIDE</span>?",
    text: "Tremor est vivos magna. Expansis ulnis video missing <br/>carnem armis caeruleum in locis.",
    button: "MAKE A BOOKING",
    leftAligned: true,
  },
  {
    id: 3,
    image: "assets/images/main-slider/image-3.jpg",
    title: "HIRE <span class='text-orange-500'>CAR</span> PROFESSIONAL",
    text: "Pestilentia est haec ambulabat mortuos. Sicut malus voodoo. Aenean a dolor <br/>vulnerum aperire accedunt, mortui iam vivam.",
    button: "CONTACT NOW",
    center: true,
  },
];

const MainSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out" });
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <section className="relative mt-[-50px] max-w-[1600px]  mx-auto">
      <Carousel className="w-full overflow-hidden relative ">
        {/* Left Arrow */}
        <button
          onClick={goToPreviousSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 "
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 "
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>

        <CarouselContent
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
          className="flex h-full sm:aspect-video aspect-[6/6]"
        >
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="relative w-full flex-shrink-0"
            >
              <div className="w-full h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-screen relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 flex flex-col justify-center p-6 sm:p-10 text-white 
                                    ${
                                      slide.center
                                        ? "items-center text-center"
                                        : "items-start md:pl-24 lg:pl-48"
                                    }`}
                >
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl uppercase mb-4 w-full sm:w-[80%] md:w-[70%] font-black sm:block hidden"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                    data-aos="fade-up"
                  ></h2>
                  <p
                    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 w-full sm:w-[80%] md:w-[70%] sm:block hidden"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    dangerouslySetInnerHTML={{ __html: slide.text }}
                  ></p>
                  <div data-aos="zoom-in" data-aos-delay="400">
                    <Button className=" flex items-center leading-[24px] uppercase text-white border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-[#ff8201] hover:bg-transparent hover:text-[#ff8201] sm:block hidden h-[50px] w-[167px]">
                      {slide.button}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default MainSlider;
