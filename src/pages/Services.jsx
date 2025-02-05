import PageHeader from "@/components/CommonHeader"
import CarServices from "@/components/CarServices"

const Services = () => {
  return (
    <div>
      <PageHeader 
  title="Services" 
  breadcrumbs={[
    { path: "/", label: "HOME" },
    { path: "/services", label: "SERVICES" }
  ]}
/>

      <h1>Services</h1>
      <CarServices/>
    </div>
  )
}

export default Services
