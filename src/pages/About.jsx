import CarBookingForm from "@/components/Booking"
import PageHeader from "@/components/CommonHeader"


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
      < CarBookingForm/>
      <h1>About</h1>
    </div>
  )
}

export default About
