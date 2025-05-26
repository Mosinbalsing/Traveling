import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { BASE_URL } from "@/config/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/api/contact/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Clear form on success
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      toast.success("Message sent successfully!");

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1100px]">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Map Section */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.555340568917!2d72.9506427!3d19.1709319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8f73ee2dd51%3A0xaddd38cdc5df63e5!2sValji%20Ladha%20Rd%2C%20Mulund%20West%2C%20Mumbai%2C%20Maharashtra%20400080!5e0!3m2!1sen!2sin!4v1738394827417!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 flex justify-center gap-6 mt-10">
            <div className="phone flex gap-3 items-center">
              <FiPhone className="text-orange-500" />
              <p className="text-sm md:text-base">+091 234 5678</p>
            </div>
            <div className="email flex gap-3 items-center">
              <MdOutlineMailOutline className="text-orange-500" />
              <p className="text-sm md:text-base">info@carhire.com</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold font-sans tracking-tight text-[18px]">DROP US A LINE</h2>
          <p className="mb-8 text-muted-foreground text-gray-600 text-[14px] font-sans">
            Have questions or need assistance? Feel free to reach out to us using the form below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="hover:ring-2 hover:ring-orange-500 focus:ring-2 focus:ring-orange-500 rounded-none"
              />
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                value={formData.email}
                onChange={handleChange}
                className="hover:ring-2 hover:ring-orange-500 focus:ring-2 focus:ring-orange-500 rounded-none"
              />
            </div>
            <Input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="hover:ring-2 hover:ring-orange-500 focus:ring-2 focus:ring-orange-500 rounded-none"
            />
            <Textarea
              name="message"
              placeholder="Message"
              required
              value={formData.message}
              onChange={handleChange}
              className="hover:ring-2 hover:ring-orange-500 focus:ring-2 focus:ring-orange-500 min-h-[150px] rounded-none"
            />
            <div className="mt-5 text-center md:text-left">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-semibold text-sm sm:text-[14px] bg-white transition-all duration-300 text-orange-500 px-4 sm:px-6 py-2 rounded-full mt-4 hover:bg-orange-500 hover:text-white border-2 border-orange-500 inline-block focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}