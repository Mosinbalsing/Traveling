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
import { bookingAPI, BASE_URL } from "@/config/api";

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    console.log("Filter state:", {
      status: statusFilter,
      date: dateFilter,
      totalBookings: bookings.length,
      filteredCount: filteredBookings.length
    });
  }, [statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching bookings with token:", token ? "Token exists" : "No token");
  
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      // Fetch both current and past bookings
      const [currentResponse, pastResponse] = await Promise.all([
        bookingAPI.getBooking(),
        fetch("http://localhost:3000/api/admin/pastbookings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      ]);
  
      // Get past bookings data
      const pastData = await pastResponse.json();
      console.log("Past Bookings API Response:", pastData);
  
      // Format current bookings
      if (!currentResponse.success) {
        throw new Error(currentResponse.message || "Failed to fetch current bookings");
      }
  
      const currentBookings = currentResponse.data.map(booking => ({
        id: booking.booking_id,
        userName: booking.user_name || "User",
        travelDate: formatDate(booking.travel_date),
        from: booking.pickup_location || "N/A",
        to: booking.drop_location || "N/A",
        status: booking.status,
        price: booking.price || 0,
        vehicleType: booking.vehicle_type || "N/A",
        userEmail: booking.user_email || "N/A",
        userMobile: booking.user_mobile || "N/A",
        numberOfPassengers: booking.number_of_passengers || 1,
        bookingDate: formatDate(booking.booking_date)
      }));
  
      // Format past bookings
      const pastBookings = pastData.data.map(booking => ({
        id: booking.booking_id,
        userName: booking.user_name || "User",
        travelDate: formatDate(booking.travel_date),
        from: booking.pickup_location || "N/A",
        to: booking.drop_location || "N/A",
        status: "past",
        price: booking.price || 0,
        vehicleType: booking.vehicle_type || "N/A",
        userEmail: booking.user_email || "N/A",
        userMobile: booking.user_mobile || "N/A",
        numberOfPassengers: booking.number_of_passengers || 1,
        bookingDate: formatDate(booking.booking_date)
      }));
  
      // Combine all bookings
      const allBookings = [...currentBookings, ...pastBookings];
  
      // Calculate and log booking statistics
      const stats = allBookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {});
  
      console.log("Booking Statistics:", {
        total: allBookings.length,
        current: currentBookings.length,
        past: pastBookings.length,
        upcoming: stats.upcoming || 0,
        confirmed: stats.confirmed || 0,
        completed: stats.completed || 0,
        cancelled: stats.cancelled || 0
      });
  
      setBookings(allBookings);
  
    } catch (error) {
      console.error("Error fetching bookings:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleCancelBooking = async (booking) => {
    try {
      // Ask for confirmation instead of reason
      if (!window.confirm("Are you sure you want to cancel this booking?")) {
        return;
      }

      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/admin/login");
        return;
      }

      // Log the booking object to debug
      console.log("Attempting to cancel booking:", {
        bookingId: booking.id,
        bookingObject: booking,
        url: `${BASE_URL}/api/admin/bookings/cancel/${booking.id}`
      });

      // Use booking.id instead of booking.booking_id
      const response = await fetch(`${BASE_URL}/api/bookings/cancel/${booking.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      // Log the response status and headers for debugging
      console.log('Cancel response status:', response.status);
      console.log('Cancel response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server returned ${response.status}`);
      }

      const result = await response.json();
      console.log("Cancel booking response:", result);

      // Update the booking status in the local state
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === booking.id ? { ...b, status: 'cancelled' } : b
        )
      );

      // If a booking is selected in the details view, update it there too
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking(prev => ({ ...prev, status: 'cancelled' }));
      }

      toast.success(result.message || "Booking cancelled successfully");
      setShowBookingDetails(false);

      // Refresh the bookings list
      await fetchBookings();

    } catch (error) {
      console.error("Error cancelling booking:", error);
      
      // More specific error messages
      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.");
      } else if (error.message.includes('404')) {
        toast.error("Booking not found or already cancelled.");
      } else if (error.message.includes('non-JSON')) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Failed to cancel booking");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // For date filtering
    const bookingDate = new Date(booking.travelDate.split('/').reverse().join('-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // For All Bookings, show both past and upcoming
    if (statusFilter === "all") {
      if (bookingDate < today) {
        return booking.status === "past" || booking.status === "completed" || booking.status === "cancelled";
      } else {
        return booking.status === "upcoming" || booking.status === "confirmed";
      }
    }
    
    // For specific status filters
    return booking.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const canCancelBooking = (booking) => {
    return ["upcoming", "confirmed"].includes(booking.status.toLowerCase());
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
          <div className="flex gap-4">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="upcoming">Upcoming Only</SelectItem>
                <SelectItem value="confirmed">Confirmed Only</SelectItem>
                <SelectItem value="completed">Completed Only</SelectItem>
                <SelectItem value="cancelled">Cancelled Only</SelectItem>
                <SelectItem value="past">Past Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {statusFilter === "all" ? (
            <div className="flex gap-4">
              <span>Total Bookings: {filteredBookings.length}</span>
              <span>Upcoming: {filteredBookings.filter(b => ["upcoming", "confirmed"].includes(b.status)).length}</span>
              <span>Past/Completed/Cancelled: {filteredBookings.filter(b => ["past", "completed", "cancelled"].includes(b.status)).length}</span>
            </div>
          ) : (
            <span>Showing {filteredBookings.length} {statusFilter} bookings</span>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{booking.travelDate}</TableCell>
                  <TableCell>{booking.from}</TableCell>
                  <TableCell>{booking.to}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === "upcoming" ? "bg-yellow-100 text-yellow-800" :
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                      booking.status === "completed" ? "bg-blue-100 text-blue-800" :
                      booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                      booking.status === "past" ? "bg-gray-100 text-gray-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>₹{booking.price}</TableCell>
                  <TableCell>{booking.vehicleType}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      {booking.status !== 'cancelled' && (
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
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader className="bg-white">
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Booking Information</h3>
                    <p>Booking ID: {selectedBooking.id}</p>
                    <p>Status: 
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                        selectedBooking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : selectedBooking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedBooking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </p>
                    <p>Price: ₹{selectedBooking.price}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">User Details</h3>
                    <p>Name: {selectedBooking.userName}</p>
                    <p>Email: {selectedBooking.userEmail}</p>
                    <p>Phone: {selectedBooking.userMobile}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Travel Details</h3>
                    <p>Date: {selectedBooking.travelDate}</p>
                    <p>From: {selectedBooking.from}</p>
                    <p>To: {selectedBooking.to}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Vehicle Details</h3>
                    <p>Type: {selectedBooking.vehicleType}</p>
                    <p>Passengers: {selectedBooking.numberOfPassengers}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowBookingDetails(false)}>
                    Close
                  </Button>
                  {selectedBooking.status !== 'cancelled' && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBooking(selectedBooking)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 