import AboutComponent from "@/components/AboutComponent"
import CarBookingform from "@/components/CarBookingform2"
import MainSlider from "@/components/MainSlider"
import OurCarsComponent from "@/components/OurCarsComponenet"

import ServicesComponent from "@/components/ServicesComponenet"
import StackedCards from "@/components/StackedCards"


const Home = () => {
  return (
    <>
        <MainSlider/>
        <CarBookingform/>
        <AboutComponent/>
        <StackedCards/>
        <ServicesComponent/>
        <OurCarsComponent/>
      <h1>Home</h1>
    </>
  )
}

export default Home
