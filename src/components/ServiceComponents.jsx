import React from "react";

const ServiceComponents = () => {
  const services = [
    {
      icon: "💰", // Replace with your icon or image
      title: "Fixed Rates",
      description:
        "In omni memoria patriae religions sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      icon: "🚗", // Replace with your icon or image
      title: "Reliable Transfers",
      description:
        "In omni memoria patriae religions sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      icon: "❌", // Replace with your icon or image
      title: "Free Cancellation",
      description:
        "In omni memoria patriae religions sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      icon: "🏆", // Replace with your icon or image
      title: "Award Winning Service",
      description:
        "In omni memoria patriae religions sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      icon: "⭐", // Replace with your icon or image
      title: "Quality Vehicles",
      description:
        "In omni memoria patriae religions sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
    {
      icon: "⏰", // Replace with your icon or image
      title: "24H Customer Service",
      description:
        "In omni memoria patriae religions sunt diri undead historiarum. Golums, zombies et fascinati.",
    },
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            PROVIDING AMAZING SERVICES <br /> TO OUR CLIENTS
          </h2>
          <h4 className="text-xl text-gray-500 rotate-[-90deg] absolute top-1/2 left-[-50px] transform -translate-y-1/2">
            SERVICES
          </h4>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[830px] mx-auto relative">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative mb-16 group transition-all duration-300"
            >
              <div className="flex items-start">
                {/* Icon Box */}
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border-8 border-transparent group-hover:bg-orange-300/30 transition-all duration-300">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-500 transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Image */}
        <div className="absolute bottom-[-50px] left-full hidden lg:block">
          <img
            src="/images/resource/services-img.png"
            alt="Services"
            className="max-w-none"
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceComponents;