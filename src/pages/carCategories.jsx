import { useState  } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Wagnor from "assets/images/Cars/Wagnor.png";
import Swift from "assets/images/Cars/Swift.png";
import Crysta from "assets/images/Cars/crysta.png";
import Innova from "assets/images/Cars/Innova.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { authAPI, bookingAPI, taxiAPI } from "@/config/api";

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
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, availableTaxis = [] } = location.state || {};
  const [availableTaxisState, setAvailableTaxis] = useState(availableTaxis);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerificationRequired, setIsOtpVerificationRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedBookingDetails, setEditedBookingDetails] = useState(bookingDetails || {});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState("");
  const [isUserDetailsRequired, setIsUserDetailsRequired] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const cities = [
    "Pune",
    "Shirdi",
    "Mahabaleshwar",
    "Lonavala",
    "Mumbai",
    "Nashik",
    "Kolhapur",
    "Ahmadnagar",
    "Sambhaji Nagar"
  ];

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">No booking details available</p>
      </div>
    );
  }

  const handleMobileSubmit = async () => {
    setIsLoading(true);

    try {
      if (!mobile) {
        throw new Error("Mobile number is required");
      }

      // Get user details from checkMobileExists
      const userResponse = await bookingAPI.checkMobileExists(mobile);
      // Add detailed logging
      console.log("Complete User Response:", userResponse);
      console.log("Response Status:", userResponse.success);
      console.log("Response Data:", userResponse.data);

      if (userResponse.success && userResponse.data) {
        // Log the user details in a structured way
        const userData = {
          name: userResponse.data.name,
          email: userResponse.data.email,
          mobile: userResponse.data.mobile,
          // Add any other fields that come in the response
        };
        console.log("Found User Details:", userData);

        // Auto-fill the form with existing user details
        setName(userData.name);
        setEmail(userData.email);
        setIsUserDetailsRequired(false);

        // Log the state updates
        console.log("Form Auto-filled with:", {
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile
        });
      } else {
        // If user not found, show the form to collect details
        setIsUserDetailsRequired(true);
        console.log("No existing user found for mobile:", mobile);
      }

      // Proceed with OTP sending
      const otpResponse = await bookingAPI.sendOTP({
        phoneNumber: mobile,
        userName: userResponse.data?.name || "user"
      });

      if (otpResponse.success) {
        toast.success("OTP sent to your mobile number.");
        setIsOtpVerificationRequired(true);
        console.log("OTP sent successfully");
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error in handleMobileSubmit:", error);
      setIsUserDetailsRequired(true);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(mobile, name, email, otp);
  
  const handleUserDetailsSubmit = async () => {
    setIsLoading(true);
    try {
      // Ensure mobile, name, and email are available
      if (!mobile || !name || !email) {
        throw new Error("Mobile, name, and email are required");
      }

      const response = await authAPI.storeUserDetails({ mobile, name, email });
      console.log("User  details storage response:", response);
      
      if (response.success) {
        toast.success("User  details stored successfully. OTP sent.");
        const otpResponse = await bookingAPI.sendOTP({
          phoneNumber: mobile,
          userName: name
        });
        if (otpResponse.success) {
          setIsOtpVerificationRequired(true);
          setIsUserDetailsRequired(false); // Hide name and email fields
        } else {
          throw new Error("Failed to send OTP");
        }
      } else {
        throw new Error("Failed to store user details");
      }
    } catch (error) {
      console.error("Error storing user details:", error);
      toast.error(error.message || "Failed to store user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const phoneNumber = mobile;
    try {
      // Verify OTP
      const response = await bookingAPI.verifyOTP({ phoneNumber, otp });
      console.log("OTP Verification Response:", response);
      
      if (response.success) {
        toast.success("OTP verified successfully.");
        setIsMobileDialogOpen(false);

        // Map the vehicle type to match backend expectations
        const vehicleTypeMap = {
          'Hatchback': 'Hatchback',
          'Sedan': 'Sedan',
          'SUV': 'SUV',
          'Prime SUV': 'Prime_SUV'
        };

        const formattedVehicleType = vehicleTypeMap[selectedCar.type];
        console.log("Original Vehicle Type:", selectedCar.type);
        console.log("Formatted Vehicle Type:", formattedVehicleType);

        if (!formattedVehicleType) {
          throw new Error(`Invalid vehicle type: ${selectedCar.type}`);
        }

        // Prepare booking data using existing user data
        const bookingData = {
          bookingDate: new Date().toISOString(),
          travelDate: editedBookingDetails.departureDate,
          vehicleType: formattedVehicleType,
          numberOfPassengers: parseInt(editedBookingDetails.peopleCount),
          pickupLocation: editedBookingDetails.pickUpLocation,
          dropLocation: editedBookingDetails.dropOffLocation,
          userDetails: {
            name: name,
            email: email,
            mobile: mobile
          }
        };

        console.log("Booking Data being sent:", bookingData);

        try {
          // Create booking
          const bookingResponse = await bookingAPI.createBookingDetails(bookingData);
          console.log("Booking Response:", bookingResponse);

          if (bookingResponse.success) {
            toast.success("Booking created successfully!");
            
            // Prepare navigation data using the booking data directly
            const navigationData = {
              bookingDetails: {
                bookingDate: bookingData.bookingDate,
                travelDate: bookingData.travelDate,
                PickupLocation: bookingData.pickupLocation,
                DropLocation: bookingData.dropLocation,
                vehicleType: bookingData.vehicleType,
                numberOfPassengers: bookingData.numberOfPassengers,
                pickupAddress: bookingData.pickupLocation,
                pickupCity: bookingData.pickupLocation,
                price: bookingData.price,
                userDetails: {
                  name: name,
                  email: email,
                  mobile: mobile
                }
              }
            };

            console.log("Navigation Data:", navigationData);

            // Navigate immediately after successful booking
            navigate("/booking-success", { 
              state: navigationData,
              replace: true
            });
          } else {
            throw new Error(bookingResponse.message || "Failed to create booking");
          }
        } catch (error) {
          console.error("Booking Creation Error:", error);
          toast.error(error.message || "Failed to create booking");
          throw error;
        }
      } else {
        throw new Error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleOtpSubmit:", error);
      toast.error(error.message || "Failed to process booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (car) => {
    setSelectedCar(car);
    setIsMobileDialogOpen(true);
  };

  const handleEditOpen = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { departureDate, pickUpLocation, dropOffLocation, peopleCount, travelType } = editedBookingDetails;

      if (pickUpLocation === dropOffLocation) {
        setError("Pickup and Drop Location cannot be the same.");
        toast.error("Pickup and Drop Location cannot be the same.");
        return;
      }

      if (!departureDate || !pickUpLocation || !dropOffLocation || !peopleCount) {
        setError("Please fill in all required fields.");
        return;
      }

      const formData = {
        departureDate,
        pickUpLocation,
        dropOffLocation,
        peopleCount: parseInt(peopleCount),
        travelType
      };

      const response = await taxiAPI.getAvailableTaxis(formData);

      if (response.success) {
        toast.success('Results updated successfully');
        setAvailableTaxis(response.data.availableVehicles);
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.message || 'Failed to update results');
    } finally {
      setIsLoading(false);
      handleEditClose(); // Close the edit dialog after submission
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBookingDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen sm:mt-0 mt-[100px]">
      <div className="w-full lg:w-80 bg-white p-4 lg:p-6 shadow-lg lg:fixed lg:h-screen lg:overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" className="w-[48%]">
            <Link to="/">Back to home</Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-[48%]"
            onClick={handleEditOpen} // Open edit dialog
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
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-6 overflow-auto lg:ml-80">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h2 className="text-xl font-semibold">Available Cars</h2>
          <p className="text-base lg:text-lg">
            Showing {availableTaxisState.length} results
          </p>
        </div>

        <div className="grid gap-4 lg:gap-6">
          {availableTaxisState.map((taxi, index) => {
            const matchedCar = carCategories.find(car => 
              car.type.toLowerCase().replace(/[\s_-]/g, '') === 
              taxi.type.toLowerCase().replace(/[\s_-]/g, '')
            );

            if (!matchedCar) {
              console.log("No match found for taxi type:", taxi.type);
              return null;
            }

            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
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

                    <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Starting from</div>
                        <div className="text-xl lg:text-2xl font-bold">₹{matchedCar.price?.toLocaleString()}</div>
                        <Button
                          className="bg-[#76B82A] hover:bg-[#5a8c20] text-sm lg:text-base"
                          onClick={() => handleBookNow(matchedCar)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mobile Dialog */}
      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Enter Your Mobile Number</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isUserDetailsRequired) {
                handleUserDetailsSubmit();
              } else {
                isOtpVerificationRequired ? handleOtpSubmit(e) : handleMobileSubmit();
              }
            }}
            className="space-y-4"
          >
            {!isOtpVerificationRequired ? (
              <>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                {isUserDetailsRequired && (
                  <div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP sent to your mobile"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMobileDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : isOtpVerificationRequired ? "Verify OTP" : isUserDetailsRequired ? "Submit Details" : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Details Dialog */}
      <Dialog open={isEditOpen} onOpenChange={handleEditClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Booking Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <Input
                type="text"
                name="pickUpLocation"
                value={editedBookingDetails.pickUpLocation}
                onChange={handleInputChange}
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Drop-off Location</Label>
              <Input
                type="text"
                name="dropOffLocation"
                value={editedBookingDetails.dropOffLocation}
                onChange={handleInputChange}
                placeholder="Enter drop-off location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                name="departureDate"
                value={editedBookingDetails.departureDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Passengers</Label>
              <Input
                type="number"
                name="peopleCount"
                value={editedBookingDetails.peopleCount}
                onChange={handleInputChange}
                placeholder="Enter number of passengers"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Travel Type</Label>
              <Input
                type="text"
                name="travelType"
                value={editedBookingDetails.travelType}
                onChange={handleInputChange}
                placeholder="Enter travel type"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleEditClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}