import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // TODO: Replace with actual API call
      // Mock data for now
      const mockBookings = [
        {
          id: 1,
          userName: "John Doe",
          userPhone: "+1234567890",
          pickupLocation: "Airport",
          dropLocation: "City Center",
          travelDate: "2024-03-20",
          departureTime: "10:00 AM",
          status: "upcoming",
          price: 50,
          vehicleType: "SUV",
          numberOfPassengers: 4
        },
        // Add more mock bookings
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm(`Are you sure you want to cancel this booking?`)) {
      try {
        // TODO: Replace with actual API call
        // Mock cancellation
        setBookings(bookings.map(b => 
          b.id === booking.id 
            ? { ...b, status: "cancelled" }
            : b
        ));
        toast.success("Booking cancelled successfully");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(booking.travelDate);
    const today = new Date();
    return bookingDate >= today && booking.status === "upcoming";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter bookings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{booking.travelDate}</TableCell>
                  <TableCell>{booking.departureTime}</TableCell>
                  <TableCell>{booking.pickupLocation}</TableCell>
                  <TableCell>{booking.dropLocation}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === "upcoming" ? "bg-green-100 text-green-800" :
                      booking.status === "past" ? "bg-gray-100 text-gray-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      {canCancelBooking(booking) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelBooking(booking)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Booking Details Dialog */}
        <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">User Details</h3>
                    <p>Name: {selectedBooking.userName}</p>
                    <p>Phone: {selectedBooking.userPhone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Journey Details</h3>
                    <p>Date: {selectedBooking.travelDate}</p>
                    <p>Time: {selectedBooking.departureTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Locations</h3>
                    <p>From: {selectedBooking.pickupLocation}</p>
                    <p>To: {selectedBooking.dropLocation}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Vehicle Details</h3>
                    <p>Type: {selectedBooking.vehicleType}</p>
                    <p>Passengers: {selectedBooking.numberOfPassengers}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Payment</h3>
                    <p>Price: ${selectedBooking.price}</p>
                    <p>Status: {selectedBooking.status}</p>
                  </div>
                </div>
                {canCancelBooking(selectedBooking) && (
                  <div className="pt-4">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleCancelBooking(selectedBooking);
                        setShowBookingDetails(false);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 