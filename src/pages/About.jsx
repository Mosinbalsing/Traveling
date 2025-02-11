import CarBookingForm from "@/components/Booking"
import PageHeader from "@/components/CommonHeader"
import SlidingAuthForm from "@/components/LogInSigUp"


const About = () => {
  return (
    <div>
      <PageHeader 
  title="Booking" 
  breadcrumbs={[
    { path: "/", label: "HOME" },
    { path: "/booking", label: "BOOKING" }
  ]}
/>
      <h1>About</h1>
    </div>
  )
}

export default About
