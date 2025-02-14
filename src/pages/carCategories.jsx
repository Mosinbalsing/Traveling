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
import { taxiAPI } from "@/config/api";

const carCategories = [
  {
    type: "Hatchback",
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
    type: "Sedan",
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
    type: "SUV",
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
    type: "Prime SUV",
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
  const { bookingDetails, availableTaxis = [] } = location.state || {};
  const [availableTaxisState, setAvailableTaxis] = useState(availableTaxis);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedBookingDetails, setEditedBookingDetails] = useState(bookingDetails);

  // Add check for logged in user
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Redirect if no booking details
  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">No booking details available</p>
      </div>
    );
  }

  const cities = ["Pune", "Shirdi", "Mahabaleshwar", "Lonavala", "Mumbai", "Nashik", "Kolhapur", "Ahmadnagar", "Sambhajinagar"];

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsEditOpen(false);

    try {
      const formData = {
        departureDate: editedBookingDetails.departureDate,
        pickUpLocation: editedBookingDetails.pickUpLocation,
        dropOffLocation: editedBookingDetails.dropOffLocation,
        peopleCount: parseInt(editedBookingDetails.peopleCount),
        travelType: editedBookingDetails.travelType
      };

      console.log('Re-fetching with updated params:', formData);
      const response = await taxiAPI.getAvailableTaxis(formData);
      console.log('Updated API Response:', response);

      if (response.success) {
        toast.success('Results updated successfully');
        setAvailableTaxis(response.data.availableVehicles);
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('Failed to update results');
    } finally {
      setIsLoading(false);
    }
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

            setEditedBookingDetails(prev => ({
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
  const handleBookNow = (car) => {
    navigate('/booking-confirmation', {
      state: {
        carDetails: {
          carName: car.type,
          carImage: car.image,
          carFeatures: car.features,
          price: car.price,
          data: editedBookingDetails
        }
      }
    });
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
              <span className="text-sm lg:text-base">{editedBookingDetails.pickUpLocation}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Drop to</h2>
            <div className="flex items-center gap-2 text-red-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.dropOffLocation}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Passengers</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.peopleCount}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Date</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.departureDate}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Travel Type </h2>
            <div className="flex items-center gap-2 text-red-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.travelType}</span>
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
                  value={editedBookingDetails.departureDate}
                  onChange={(e) => setEditedBookingDetails(prev => ({
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
                    value={editedBookingDetails.pickUpLocation}
                    onChange={(e) => setEditedBookingDetails(prev => ({
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
                  value={editedBookingDetails.dropOffLocation}
                  onValueChange={(value) => setEditedBookingDetails(prev => ({
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
                  value={editedBookingDetails.peopleCount}
                  onChange={(e) => setEditedBookingDetails(prev => ({
                    ...prev,
                    peopleCount: e.target.value
                  }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      {/* Main Content - Available Cars */}
      <div className="flex-1 p-4 lg:p-6 overflow-auto lg:ml-80">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h2 className="text-xl font-semibold">Available Cars</h2>
          <p className="text-base lg:text-lg">
            Showing {availableTaxisState.length} results
          </p>
        </div>

        <div className="grid gap-4 lg:gap-6">
          {availableTaxisState.map((taxi, index) => {
            // Find the matching car category with normalized comparison
            const matchedCar = carCategories.find(car => 
              car.type.toLowerCase().replace(/[\s_-]/g, '') === 
              taxi.type.toLowerCase().replace(/[\s_-]/g, '')
            );

            // Log if no match is found
            if (!matchedCar) {
              console.log("No match found for taxi type:", taxi.type);
              return null;
            }

            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    {/* Car Image and Basic Info */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                      <div className="relative h-48 w-full sm:w-48 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={matchedCar.image}
                          alt={matchedCar.type}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold">{matchedCar.type}</h3>
                          <p className="text-sm lg:text-base text-gray-600">
                            {matchedCar.seating} | {matchedCar.ac ? "AC" : "Non-AC"}
                          </p>
                        </div>
                        
                        {/* Features */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-600">Features:</h4>
                          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                            {matchedCar.features.map((feature, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Starting from</div>
                        <div className="text-xl lg:text-2xl font-bold">₹{matchedCar.price?.toLocaleString()}</div>
                      </div>
                      <Button
                        className="bg-[#76B82A] hover:bg-[#5a8c20] text-sm lg:text-base"
                        onClick={() => handleBookNow(matchedCar)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {availableTaxisState.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No taxis available for the selected criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}