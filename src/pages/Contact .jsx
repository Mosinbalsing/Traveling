import PageHeader from "@/components/CommonHeader"
import ContactForm from "@/components/ContactForm"


const Contact  = () => {
  return (
    <div>
       <PageHeader 
  title="Contact" 
  breadcrumbs={[
    { path: "/", label: "Home" },
    { path: "/contact", label: "Contact" }
  ]}
/>
      <ContactForm/>
      <h1>Contact</h1>
    </div>
  )
}

export default Contact 
