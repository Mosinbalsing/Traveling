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
import { AspectRatio } from "@/components/ui/aspect-ratio";

const slides = [
  {
    id: 1,
    image: "images/main-slider/image-1.jpg",
    title:
      "Best Worldwide <br /><span class='text-orange-500'>Car Hire</span> Deals",
    text: "Tremor est vivos magna. Expansis ulnis video missing <br/>carnem armis caeruleum in locis.",
    button: "EXPLORE NOW",
    leftAligned: true,
  },
  {
    id: 2,
    image: "images/main-slider/image-2.jpg",
    title: "NEED A <span class='text-orange-500'>RIDE</span>?",
    text: "Tremor est vivos magna. Expansis ulnis video missing <br/>carnem armis caeruleum in locis.",
    button: "MAKE A BOOKING",
    leftAligned: true,
  },
  {
    id: 3,
    image: "images/main-slider/image-3.jpg",
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
    <section className="relative sm:mt-[-45px] max-w-[1600px]  ">
      <Carousel className="w-full overflow-hidden relative ">
        {/* Left Arrow */}
        <button
          onClick={goToPreviousSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors duration-300"
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors duration-300"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>

        <CarouselContent
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
          className="flex w-full h-full bg-black flex-nowrap"
        >
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="relative w-full flex-shrink-0"
            >
              <AspectRatio
                ratio={16 / 9}
                className="relative w-[110%] h-full sm:aspect-[16/9]  lg:aspect-[16/9] aspect-[9/16]"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>

              <div
                className={`w-[100%] absolute inset-0 flex flex-col justify-center p-6 sm:p-10 text-white 
                                      ${
                                        slide.center
                                          ? "items-center text-center"
                                          : "items-start md:pl-24 lg:pl-48"
                                      }`}
              >
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl uppercase mb-4 w-full sm:w-[80%] md:w-[70%] font-black hidden sm:block"
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                  data-aos="fade-up"
                ></h2>
                <p
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 w-full sm:w-[80%] md:w-[70%] hidden sm:block"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  dangerouslySetInnerHTML={{ __html: slide.text }}
                ></p>
                <div data-aos="zoom-in" data-aos-delay="400">
                  <Button
                    variant="default"
                    className="bg-orange-500 hover:bg-transparent hover:border-orange-500 rounded-full text-sm sm:text-base font-bold px-8 sm:px-12 h-[45px] sm:h-[55px] hover:text-orange-500 hover:shadow-lg hover:border-[2px] hidden sm:block"
                  >
                    {slide.button}
                  </Button>
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
