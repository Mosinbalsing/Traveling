import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TbPigMoney, TbCar, TbDeviceDesktopCancel, TbRoad, TbStar, TbClock24 } from "react-icons/tb";

const StackedCards = () => {
  const services = [
    {
      id: 1,
      icon: <TbPigMoney className="text-4xl text-white" />,
      number: "01",
      title: "Fixed Rates",
      description: "In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      id: 2,
      icon: <TbCar className="text-4xl text-white" />,
      number: "02",
      title: "Reliable Transfers",
      description: "In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      id: 3,
      icon: <TbDeviceDesktopCancel className="text-4xl text-white" />,
      number: "03",
      title: "Free Cancellation",
      description: "In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      id: 4,
      icon: <TbRoad className="text-4xl text-white" />,
      number: "04",
      title: "Award Winning Service",
      description: "In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      id: 5,
      icon: <TbStar className="text-4xl text-white" />,
      number: "05",
      title: "Quality Vehicles",
      description: "In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      id: 6,
      icon: <TbClock24 className="text-4xl text-white" />,
      number: "06",
      title: "24H Customer Service",
      description: "In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
  ];

  const cardsData = services.map((service, index) => ({
    ...service,
    bgColor: [
      "bg-blue-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-yellow-500",
    ][index % 6], // Assign different colors to each card
  }));

  const [scrolledIndex, setScrolledIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let distance = window.innerHeight * 0.5;
      let topVal = document.querySelector(".stack-area")?.getBoundingClientRect().top || 0;
      let index = Math.floor(-1 * (topVal / distance + 1));
      setScrolledIndex(index);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full max-w-[700px] min-h-[400vh] flex flex-col lg:flex-row bg-white relative stack-area">
      {/* Left Section */}
      <div className="sticky top-0 left-0 h-screen w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-center lg:text-left">
          Our Features
        </h1>
        <p className="text-sm mt-6 w-full lg:w-80 text-center lg:text-left">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente qui quis, facere,
          cupiditate, doloremque natus ex perspiciatis ratione hic corrupti adipisci ea doloribus!
        </p>
        <button className="mt-4 px-6 py-3 bg-black text-white rounded-lg">
          See More Details
        </button>
      </div>

      {/* Right Section */}
      <div className="sticky top-0 h-screen w-full lg:w-1/2 flex items-center justify-center">
        {cardsData.map((card, index) => (
          <Card
            key={card.id}
            className={`absolute w-[300px] lg:w-[350px] h-[300px] lg:h-[350px] rounded-2xl transition-transform duration-500 ${
              index === scrolledIndex
                ? "translate-y-0 rotate-0 " + card.bgColor
                : index < scrolledIndex
                ? "-translate-y-[120vh] rotate-[-48deg] " + card.bgColor
                : "translate-y-[20px] rotate-[10deg] " + card.bgColor
            }`}
            style={{ zIndex: cardsData.length - index, border: "none" }} // Remove card border
          >
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{card.number}</span>
                {card.icon}
              </div>
              <span className="text-2xl font-bold leading-snug text-white">{card.title}</span>
              <span className="text-sm text-white">{card.description}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StackedCards;