import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UsersIcon, CalendarIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    pastBookings: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
        const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
        const adminToken = localStorage.getItem("adminToken");

        console.log("Auth Check:", {
          isAuthenticated,
          isLoggedIn,
          hasToken: !!adminToken,
          token: adminToken
        });

        if (!isAuthenticated || !isLoggedIn) {
          console.log("Authentication failed - redirecting to login");
          localStorage.removeItem("isAdminAuthenticated");
          localStorage.removeItem("adminLoggedIn");
          localStorage.removeItem("adminToken");
          toast.error("Please login to access the dashboard");
          navigate("/admin/login", { replace: true });
          return;
        }

        // Fetch dashboard data
        await Promise.all([
          fetchDashboardStats(),
          getUsers(),
          fetchPastBookings(),
          fetchRecentBookings()
        ]);
      } catch (error) {
        console.error("Auth Error:", error);
        setError(error.message);
        toast.error(error.message || "Authentication failed");
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API call
      setStats({
        totalUsers: 150,
        totalBookings: 300,
        upcomingBookings: 50,
        pastBookings: 250
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  const fetchRecentUsers = async () => {
    try {
      // TODO: Replace with actual API call
      setRecentUsers([
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", joinedDate: "2024-03-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", joinedDate: "2024-03-14" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892", joinedDate: "2024-03-13" },
      ]);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching bookings with token:", token ? "Token exists" : "No token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Making API request to:", `${BASE_URL}/api/admin/bookings`);
      const response = await fetch(`${BASE_URL}/api/admin/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API Response Data:", data);
      
      // Transform the data to match the expected format with formatted dates
      const formattedBookings = data.data.map(booking => ({
        id: booking.booking_id,
        userName: booking.user_name || "User",
        travelDate: formatDate(booking.travel_date),
        from: booking.pickup_location,
        to: booking.drop_location,
        status: booking.status,
        vehicleType: booking.vehicle_type,
        numberOfPassengers: booking.number_of_passengers,
        bookingDate: formatDate(booking.booking_date)
      }));

      console.log("Final Formatted Bookings:", formattedBookings);

      // Filter bookings into upcoming and past
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingBookings = formattedBookings.filter(booking => {
        const bookingDate = new Date(booking.travelDate);
        return bookingDate >= today && booking.status !== "completed";
      });

      const pastBookings = formattedBookings.filter(booking => {
        const bookingDate = new Date(booking.travelDate);
        return bookingDate < today || booking.status === "completed";
      });

      setUpcomingBookings(upcomingBookings);
      setPastBookings(pastBookings);

      // Update dashboard stats
      setStats({
        totalUsers: data.data.length > 0 ? data.data[0].total_users || 0 : 0,
        totalBookings: formattedBookings.length,
        upcomingBookings: upcomingBookings.length,
        pastBookings: pastBookings.length
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || "Failed to load bookings");
      setUpcomingBookings([]);
      setPastBookings([]);
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

  const fetchPastBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching past bookings with token:", token ? "Token exists" : "No token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Making API request to:", `${BASE_URL}/api/admin/pastbookings`);
      const response = await fetch(`${BASE_URL}/api/admin/pastbookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API Response Data:", data);
      
      if (!data.success) {
        throw new Error("Failed to fetch past bookings");
      }

      // Transform the data to match the expected format with formatted dates
      const formattedBookings = data.data.map(booking => ({
        id: booking.booking_id,
        userName: booking.user_name || "User",
        travelDate: formatDate(booking.travel_date),
        from: booking.pickup_location,
        to: booking.drop_location,
        status: booking.status,
        vehicleType: booking.vehicle_type,
        numberOfPassengers: booking.number_of_passengers,
        bookingDate: formatDate(booking.booking_date),
        userEmail: booking.user_email,
        userMobile: booking.user_mobile
      }));

      console.log("Final Formatted Past Bookings:", formattedBookings);

      // Set past bookings directly since we're already fetching past bookings
      setPastBookings(formattedBookings);

      // Update dashboard stats for past bookings
      setStats(prevStats => ({
        ...prevStats,
        pastBookings: data.count || formattedBookings.length
      }));

    } catch (error) {
      console.error("Error fetching past bookings:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || "Failed to load past bookings");
      setPastBookings([]);
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching users with token:", token ? "Token exists" : "No token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Making API request to:", `${BASE_URL}/api/admin/users`);
      const response = await fetch(`${BASE_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response: from admin dashboard get users", response);
      console.log("API Response Status:", response.status);
      console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API Response Data:", data);
      
      // Check if data.users exists, if not use the data directly
      const users = data.users || data;
      console.log("Processed Users Data:", users);
      
      // Transform the data to match the expected format
      const formattedUsers = users.data.map(user => ({
        user_id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      }));

      console.log("Final Formatted Users:", formattedUsers);
      setRecentUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || "Failed to load users");
      setRecentUsers([]);
    }
  };
  const getBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching users with token:", token ? "Token exists" : "No token");

      if (!token) {
        throw new Error("No authentication token found");
      }

     
      const response = await fetch(`${BASE_URL}/api/admin/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response: from admin dashboard get bookings", response);
      console.log("API Response Status:", response.status);
      console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API Response Data:", data);
      
      // Check if data.users exists, if not use the data directly
      const users = data.users || data;
      console.log("Processed Users Data:", users);
      
      // Transform the data to match the expected format
      const formattedUsers = users.data.map(user => ({
        user_id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      }));

      console.log("Final Formatted Users:", formattedUsers);
      setRecentUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(error.message || "Failed to load users");
      setRecentUsers([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button onClick={() => navigate("/admin/login")} className="mt-4">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Users */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Bookings</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Upcoming Bookings</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.upcomingBookings}</p>
              </div>
            </div>
          </div>

          {/* Past Bookings */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Past Bookings</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.pastBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/users">View All</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">View All</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Route</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>{booking.travelDate}</TableCell>
                      <TableCell className="hidden sm:table-cell">{booking.from} → {booking.to}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Past Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto xl:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Past Bookings</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">View All</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden sm:table-cell">From</TableHead>
                    <TableHead className="hidden sm:table-cell">To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Vehicle Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>{booking.travelDate}</TableCell>
                      <TableCell className="hidden sm:table-cell">{booking.from}</TableCell>
                      <TableCell className="hidden sm:table-cell">{booking.to}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{booking.vehicleType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 