import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CarBookingform() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mobileNumber, setMobileNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    vehicleType: "",
    departureDate: "",
    pickUpLocation: "",
    dropOffLocation: "",
    peopleCount: 1,
    travelType: "return",
  })

  const handleBookNow = (e) => {
    e.preventDefault()
    setIsDialogOpen(true)
  }

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      console.log("OTP sent to:", mobileNumber)
      setIsOtpSent(true)
      setIsDialogOpen(false) // Close the first dialog when OTP dialog opens
    } else {
      alert("Please enter a valid 10-digit mobile number.")
    }
  }

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      console.log("OTP Verified:", otp)
      // Reset mobile number and OTP
      setMobileNumber("")
      setOtp("")
      setIsOtpSent(false)

      // Open the booking details dialog
      setBookingDetails({
        vehicleType: "SUV", // You can dynamically fill these values
        departureDate: "2025-02-05", // Replace with actual selected values
        pickUpLocation: "Airport",
        dropOffLocation: "Downtown",
        peopleCount: 4,
        travelType: "return",
      })
      setIsBookingDetailsOpen(true) // Show the booking details dialog
    } else {
      alert("Please enter a valid 6-digit OTP.")
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#FAFAFA] relative sm:top-[-200px]">
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" onSubmit={handleBookNow}>
            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">VEHICLE TYPE</Label>
              <Select
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, vehicleType: e.target.value })
                }
              >
                <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="SUV" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">DEPARTURE DATE</Label>
              <Input
                type="date"
                className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, departureDate: e.target.value })
                }
              />
            </div>

            {/* Pick Up Location */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">PICK UP LOCATION</Label>
              <Select
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, pickUpLocation: e.target.value })
                }
              >
                <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="airport">Airport</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Drop Off Location */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">DROP OFF LOCATION</Label>
              <Select
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, dropOffLocation: e.target.value })
                }
              >
                <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="airport">Airport</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of People */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-600">
                HOW MANY PEOPLES (INCLUDING CHILDREN)?
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter number of people"
                className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, peopleCount: e.target.value })
                }
              />
            </div>

            {/* Return/One Way Radio */}
            <div className="space-y-2 flex items-end">
              <RadioGroup
                defaultValue="return"
                className="flex gap-6"
                onValueChange={(value) =>
                  setBookingDetails({ ...bookingDetails, travelType: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="return" id="return" />
                  <Label htmlFor="return" className="text-sm font-semibold text-gray-600">
                    RETURN
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-way" id="one-way" />
                  <Label htmlFor="one-way" className="text-sm font-semibold text-gray-600">
                    ONE WAY
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Book Now Button */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="relative px-[43px] py-[14px] flex items-center leading-[24px] uppercase text-white border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-[#ff8201] hover:bg-transparent hover:text-[#ff8201] w-[160px] h-[50px]"
              >
                BOOK NOW
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog for Mobile Number and OTP */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Enter Mobile Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
              required
            />
            <Button
              onClick={handleSendOtp}
              className="w-[160px] h-[50px] relative px-[43px] py-[14px] flex items-center leading-[24px] uppercase text-[#ff8201] border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-transparent hover:bg-[#ff8201] hover:text-white mt-6"
            >
              Send OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for OTP Verification */}
      <Dialog open={isOtpSent} onOpenChange={setIsOtpSent}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
              required
            />
            <Button
              onClick={handleVerifyOtp}
              className="w-[160px] h-[50px] relative px-[43px] py-[14px] flex items-center leading-[24px] uppercase text-[#ff8201] border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-transparent hover:bg-[#ff8201] hover:text-white mt-6"
            >
              Verify OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog to Show Booking Details */}
      <Dialog open={isBookingDetailsOpen} onOpenChange={setIsBookingDetailsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Vehicle Type: {bookingDetails.vehicleType}</p>
            <p>Departure Date: {bookingDetails.departureDate}</p>
            <p>Pick Up Location: {bookingDetails.pickUpLocation}</p>
            <p>Drop Off Location: {bookingDetails.dropOffLocation}</p>
            <p>Number of People: {bookingDetails.peopleCount}</p>
            <p>Travel Type: {bookingDetails.travelType}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
