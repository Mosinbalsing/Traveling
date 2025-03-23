import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import jsPDF from 'jspdf';
import logo from "../assets/images/logo.png"; // Make sure this path is correct

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  console.log("booking Success", bookingDetails);
    
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    // Redirect if no booking details
    if (!bookingDetails) {
      navigate('/');
    }
  }, [bookingDetails, navigate]);

  if (!bookingDetails) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Price mapping for vehicle types
  const vehiclePrices = {
    'Hatchback': 2500,
    'Sedan': 2500,
    'SUV': 3500,
    'Prime_SUV': 4500
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add logo
    const logoWidth = 50; // Adjust size as needed
    const logoHeight = 20; // Adjust size as needed
    // Add logo image - positioned at top left
    doc.addImage(logo, 'PNG', 20, 10, logoWidth, logoHeight);
    
    // Add company header - adjusted position to be next to logo
    doc.setFontSize(22);
    doc.setTextColor(0, 100, 0); // Dark green color
    doc.text('Shree Tours and Travel', 105, 25, { align: 'center' });
    
    // Add booking confirmation
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Booking Confirmation', 105, 40, { align: 'center' });

    // Add decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 100, 0);
    doc.line(20, 45, 190, 45);

    // Set font size for content
    doc.setFontSize(12);
    let y = 60; // Adjusted starting position

    // Booking Details
    doc.setFont(undefined, 'bold');
    doc.text('Booking Details:', 20, y);
    doc.setFont(undefined, 'normal');
    y += 10;
    doc.text(`Booking Date: ${formatDate(bookingDetails.bookingDate)}`, 20, y);
    y += 7;
    doc.text(`Travel Date: ${formatDate(bookingDetails.travelDate)}`, 20, y);
    y += 7;
    if (bookingDetails.pickupTime) {
      doc.text(`Pickup Time: ${formatTime(bookingDetails.pickupTime)}`, 20, y);
      y += 7;
    }

    // Location Details
    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Location Details:', 20, y);
    doc.setFont(undefined, 'normal');
    y += 10;
    doc.text(`Pickup Location: ${bookingDetails.PickupLocation}`, 20, y);
    y += 7;
    doc.text(`Drop Location: ${bookingDetails.DropLocation}`, 20, y);
    y += 7;

    // Vehicle Details
    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Vehicle Details:', 20, y);
    doc.setFont(undefined, 'normal');
    y += 10;
    doc.text(`Vehicle Type: ${bookingDetails.vehicleType}`, 20, y);
    y += 7;
    doc.text(`Number of Passengers: ${bookingDetails.numberOfPassengers}`, 20, y);
    y += 7;

    // Format and add price with proper Indian currency format
    const price = vehiclePrices[bookingDetails.vehicleType];
    const formattedPrice = price ? formatPrice(price) : 'Price not available';
    doc.text(`Price: ${formattedPrice}`, 20, y);
    y += 7;

    // User Details
    if (bookingDetails.userDetails) {
      y += 5;
      doc.setFont(undefined, 'bold');
      doc.text('User Details:', 20, y);
      doc.setFont(undefined, 'normal');
      y += 10;
      doc.text(`Name: ${bookingDetails.userDetails.name}`, 20, y);
      y += 7;
      doc.text(`Email: ${bookingDetails.userDetails.email}`, 20, y);
      y += 7;
      doc.text(`Mobile: ${bookingDetails.userDetails.mobile}`, 20, y);
    }

    // Add decorative bottom line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 100, 0);
    doc.line(20, 270, 190, 270);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for choosing Shree Tours and Travel', 105, 280, { align: 'center' });
    doc.text('For any queries, please contact: +91 9730260479', 105, 285, { align: 'center' });

    // Save the PDF
    doc.save('booking-details.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2" data-aos="fade-up">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600" data-aos="fade-up" data-aos-delay="100">
            Your taxi has been successfully booked
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up" data-aos-delay="200">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-medium">{formatDate(bookingDetails.bookingDate)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Travel Date</p>
                  <p className="font-medium">{formatDate(bookingDetails.travelDate)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Pickup Time</p>
                  <p className="font-medium">{formatTime(bookingDetails.pickupTime)}</p>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Location Details</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-medium">{bookingDetails.PickupLocation}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Drop Location</p>
                  <p className="font-medium">{bookingDetails.DropLocation}</p>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Vehicle Type</p>
                  <p className="font-medium">{bookingDetails.vehicleType}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Number of Passengers</p>
                  <p className="font-medium">{bookingDetails.numberOfPassengers}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium text-green-600">
                    {formatPrice(vehiclePrices[bookingDetails.vehicleType]) || 'Price not available'}
                  </p>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">User Details</h2>
                {bookingDetails.userDetails && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{bookingDetails.userDetails.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{bookingDetails.userDetails.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium">{bookingDetails.userDetails.mobile}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back to Home
              </Button>
              <Button 
                onClick={downloadPDF}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                Download Booking Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}