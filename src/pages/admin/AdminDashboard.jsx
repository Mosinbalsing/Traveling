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

        if (!isAuthenticated || !isLoggedIn) {
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
          fetchRecentUsers(),
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
      // TODO: Replace with actual API call
      const mockBookings = [
        { id: 1, userName: "John Doe", travelDate: "2024-03-20", from: "Airport", to: "City Center", status: "upcoming" },
        { id: 2, userName: "Jane Smith", travelDate: "2024-03-21", from: "Hotel", to: "Mall", status: "upcoming" },
        { id: 3, userName: "Mike Johnson", travelDate: "2024-03-19", from: "Station", to: "Airport", status: "upcoming" },
      ];
      
      const mockPastBookings = [
        { id: 4, userName: "Alice Brown", travelDate: "2024-03-10", from: "Mall", to: "Hotel", status: "completed" },
        { id: 5, userName: "Bob Wilson", travelDate: "2024-03-09", from: "Airport", to: "Hotel", status: "completed" },
        { id: 6, userName: "Carol White", travelDate: "2024-03-08", from: "Hotel", to: "Station", status: "completed" },
      ];

      setUpcomingBookings(mockBookings);
      setPastBookings(mockPastBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
                <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Bookings</h2>
                <p className="text-2xl font-semibold text-gray-800">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <CalendarIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Upcoming Bookings</h2>
                <p className="text-2xl font-semibold text-gray-800">{stats.upcomingBookings}</p>
              </div>
            </div>
          </div>

          {/* Past Bookings */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Past Bookings</h2>
                <p className="text-2xl font-semibold text-gray-800">{stats.pastBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/users">View All</Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.joinedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">View All</Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Route</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.travelDate}</TableCell>
                    <TableCell>{booking.from} → {booking.to}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Past Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Past Bookings</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">View All</Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.travelDate}</TableCell>
                    <TableCell>{booking.from}</TableCell>
                    <TableCell>{booking.to}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                        {booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 