import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Wagnor from "assets/images/Cars/Wagnor.png";
import Swift from "assets/images/Cars/Swift.png";
import Crysta from "assets/images/Cars/crysta.png";
import Innova from 'assets/images/Cars/Innova.png';
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MdOutlineMyLocation } from "react-icons/md";
import { toast } from "react-toastify";
import axios from 'axios';

const carCategories = [
  {
    name: "Mini",
    image: Wagnor,
    seating: "4 + 1 Seater",
    ac: true,
    price: 2500,
    features: [
      "Comfortable seating",
      "Luggage: 2 Small Bags",
      "Fuel: Petrol/CNG",
      "Best for small families"
    ],
    mileage: "20-22 km/l",
    transmission: "Manual"
  },
  {
    name: "Prime Sedan",
    image: Swift,
    seating: "4 + 1 Seater",
    ac: true,
    price: 2500,
    features: [
      "Premium comfort",
      "Luggage: 2 Large Bags",
      "Fuel: Petrol/Diesel",
      "Best for long trips"
    ],
    mileage: "18-20 km/l",
    transmission: "Manual/Automatic"
  },
  {
    name: "Prime SUV",
    image: Innova,
    seating: "6 + 1 Seater",
    ac: true,
    price: 3500,
    features: [
      "Spacious interiors",
      "Luggage: 3 Large Bags",
      "Fuel: Diesel",
      "Perfect for group travel"
    ],
    mileage: "14-16 km/l",
    transmission: "Manual"
  },
  {
    name: "Prime SUV+",
    image: Crysta,
    seating: "6 + 1 Seater",
    ac: true,
    price: 4500,
    features: [
      "Luxury comfort",
      "Luggage: 4 Large Bags",
      "Fuel: Diesel",
      "Best for premium travel"
    ],
    mileage: "12-14 km/l",
    transmission: "Automatic"
  }
];

export default function CarRental() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking details from state
  const [bookingDetails, setBookingDetails] = useState(location.state || {});
  const { departureDate, pickUpLocation, dropOffLocation, peopleCount, travelType } = bookingDetails;
  
  // Dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Add check for logged in user
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Redirect if no booking details
  if (!bookingDetails.departureDate) {
    navigate('/');
    return null;
  }

  const cities = ["PUNE", "SHIRDI", "MAHABLESHWAR", "Lonavala", "Mumbai", "Nashik", "Kolhapur", "Ahmadnagar", "Sambhajinagar"];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsEditOpen(false);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const address = data.address;
            let locationText = `${address.village || address.town || address.city}, ${address.county}, ${address.state}`;
            locationText = locationText.replace("undefined, ", "").replace(", undefined", "");

            setBookingDetails(prev => ({
              ...prev,
              pickUpLocation: locationText,
            }));
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }
      );
    }
  };

  // Modify the book now button click handler
  const handleBookNow = async (car) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.warning("Please login first to book a cab", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/log');
      }, 2000);
      return;
    }

    // Verify token with backend
    try {
      const response = await axios.get('https://noble-liberation-production.up.railway.app/api/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Token is valid, proceed with booking
        navigate('/booking-confirmation', {
          state: {
            ...bookingDetails,
            car: car.name,
            price: car.price
          }
        });
      } else {
        // Token is invalid
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate('/log');
      }
    } catch (error) {
      // Handle error
      toast.error("Please login again to continue");
      localStorage.removeItem("token");
      navigate('/log');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar Header (Fixed on desktop, wraps on mobile) */}
      <div className="w-full lg:w-80 bg-white p-4 lg:p-6 shadow-lg lg:fixed lg:h-screen lg:overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" className="w-[48%]">
            <Link to="/">Back to home</Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-[48%]"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Details
          </Button>
        </div>

        <div className="flex flex-row lg:flex-col justify-between lg:justify-start space-y-0 lg:space-y-6 flex-wrap">
          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Pickup from</h2>
            <div className="flex items-center gap-2 text-green-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{pickUpLocation}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Drop to</h2>
            <div className="flex items-center gap-2 text-red-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{dropOffLocation}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Passengers</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{peopleCount}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Date</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{departureDate}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Travel Type </h2>
            <div className="flex items-center gap-2 text-red-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{travelType}</span>
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Booking Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={bookingDetails.departureDate}
                  onChange={(e) => setBookingDetails(prev => ({
                    ...prev,
                    departureDate: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Input
                    type="text"
                    value={bookingDetails.pickUpLocation}
                    onChange={(e) => setBookingDetails(prev => ({
                      ...prev,
                      pickUpLocation: e.target.value
                    }))}
                    className="border-none focus:ring-0"
                    placeholder="Enter pickup location"
                  />
                  <div 
                    className="px-3 cursor-pointer"
                    onClick={fetchLocation}
                  >
                    <MdOutlineMyLocation className="text-orange-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Drop Location</Label>
                <Select 
                  value={bookingDetails.dropOffLocation}
                  onValueChange={(value) => setBookingDetails(prev => ({
                    ...prev,
                    dropOffLocation: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number of Passengers</Label>
                <Input
                  type="number"
                  min="1"
                  value={bookingDetails.peopleCount}
                  onChange={(e) => setBookingDetails(prev => ({
                    ...prev,
                    peopleCount: e.target.value
                  }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 p-4 lg:p-6 overflow-auto lg:ml-80">
        <div className="flex justify-end mb-4 lg:mb-6">
          <h2 className="text-base lg:text-lg font-semibold">Showing {carCategories.length} results</h2>
        </div>
        <div className="grid gap-4 lg:gap-6">
          {carCategories.map((car) => (
            <Card key={car.name} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  {/* Left side - Image and Basic Info */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="relative h-48 w-full sm:w-48 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={car.image || "/placeholder.svg"}
                        alt={car.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold">{car.name}</h3>
                        <p className="text-sm lg:text-base text-gray-600">
                          {car.seating} | {car.ac ? "AC" : "Non-AC"}
                        </p>
                      </div>
                      
                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Mileage:</span>
                          <span className="font-medium">{car.mileage}</span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-600">Features:</h4>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                          {car.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Price and Book Button */}
                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Starting from</div>
                      <div className="text-xl lg:text-2xl font-bold">₹{car.price.toLocaleString()}</div>
                    </div>
                    <Button
                      className="bg-[#76B82A] hover:bg-[#5a8c20] text-sm lg:text-base"
                      onClick={() => handleBookNow(car)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}