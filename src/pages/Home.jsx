import AboutComponent from "@/components/AboutComponent"
import CarBookingform from "@/components/CarBookingform"
import MainSlider from "@/components/MainSlider"
import OurCarsComponent from "@/components/OurCarsComponent"

import ServicesComponent from "@/components/ServicesComponenet"


const Home = () => {
  return (
    <>
        <MainSlider/>
        <CarBookingform/>
        <AboutComponent/>
        <ServicesComponent/>
        <OurCarsComponent/>
      <h1>Home</h1>
    </>
  )
}

export default Home
