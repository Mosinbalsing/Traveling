
import {
    TbPigMoney,
    TbCar,
    TbDeviceDesktopCancel,
    TbRoad,
    TbStar,
    TbClock24,
} from 'react-icons/tb';

export default function ServicesComponent() {
    // Array of service objects
    const services = [
        {
            id: 1,
            icon: <TbPigMoney className="text-4xl text-gray-600" />,
            number: '01',
            title: 'Fixed Rates',
            description: 'In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.',
        },
        {
            id: 2,
            icon: <TbCar className="text-4xl text-gray-600" />,
            number: '02',
            title: 'Reliable Transfers',
            description: 'In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.',
        },
        {
            id: 3,
            icon: <TbDeviceDesktopCancel className="text-4xl text-gray-600" />,
            number: '03',
            title: 'Free Cancellation',
            description: 'In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.',
        },
        {
            id: 4,
            icon: <TbRoad className="text-4xl text-gray-600" />,
            number: '04',
            title: 'Award Winning Service',
            description: 'In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.',
        },
        {
            id: 5,
            icon: <TbStar className="text-4xl text-gray-600" />,
            number: '05',
            title: 'Quality Vehicles',
            description: 'In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.',
        },
        {
            id: 6,
            icon: <TbClock24 className="text-4xl text-gray-600" />,
            number: '06',
            title: '24H Customer Service',
            description: 'In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati.',
        },
    ];

    return (
        <section className="py-10 md:py-20 relative z-10  bg-[#FAFAFA]">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="mb-10 relative">
          <h4 className="hidden md:block text-[18px] sm:text-[20px] text-gray-300 font-bold uppercase tracking-widest absolute left-[-100px] top-1/2 -translate-y-1/2 rotate-90 origin-left">
            SERVICES
          </h4>
          <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-sans font-bold text-gray-800 mb-6 text-justify md:text-left">
            PROVIDING AMAZING SERVICES <br className="hidden md:block" /> TO OUR CLIENTS
          </h2>
        </div>


                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="p-8 rounded-lg  relative">
                            {/* Icon Box */}
                            <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
                                {service.icon}
                            </div>

                            {/* Number */}
                            <div className="absolute top-4 right-4 bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                                {service.number}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                <a href="/services" className="hover:text-orange-500 transition-colors duration-300 font-sans">
                                    {service.title}
                                </a>
                            </h3>
-
                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed font-sans text-[16px]">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}