import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
    console.log("booking Succes",bookingDetails);
    
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
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-medium">{bookingDetails._id}</p>
                </div>
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
                  <p className="text-sm text-gray-600">Pickup Address</p>
                  <p className="font-medium">
                    {bookingDetails.pickupAddress}, {bookingDetails.pickupCity} - {bookingDetails.pickupPincode}
                  </p>
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
                onClick={() => navigate('/bookings')}
                className="w-full sm:w-auto"
              >
                View All Bookings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}