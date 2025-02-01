import PageHeader from "@/components/CommonHeader"


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
    </div>
  )
}

export default Services
