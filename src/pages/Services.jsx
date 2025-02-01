import PageHeader from "@/components/CommonHeader"


const Services = () => {
  return (
    <div>
      <PageHeader 
  title="Services" 
  breadcrumbs={[
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" }
  ]}
/>

      <h1>Services</h1>
    </div>
  )
}

export default Services
