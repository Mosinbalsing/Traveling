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
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
  const [userTrends, setUserTrends] = useState([]);

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

        // Fetch data in sequence to ensure correct counts
        await fetchDashboardStats();
        await fetchPastBookings(); // Fetch past bookings first
        await fetchRecentBookings(); // Then fetch recent bookings
        await getUsers();

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

  useEffect(() => {
    if (Array.isArray(recentUsers)) {
      // Group users by month
      const usersByMonth = recentUsers.reduce((acc, user) => {
        const month = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for chart
      const trends = Object.entries(usersByMonth).map(([month, count]) => ({
        month,
        count
      }));

      setUserTrends(trends);
    }
  }, [recentUsers]);

  const fetchDashboardStats = async () => {
    try {
      // Initialize stats with zeros instead of hardcoded values
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        upcomingBookings: 0,
        pastBookings: 0,
        cancelledBookings: 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3000/api/admin/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Recent Bookings API Response:", data);

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

      // Filter bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingBookings = formattedBookings.filter(booking => {
        const bookingDate = new Date(booking.travelDate.split('/').reverse().join('-'));
        return bookingDate >= today && booking.status !== "completed";
      });

      setUpcomingBookings(upcomingBookings);

      // Update stats for upcoming bookings
      setStats(prevStats => ({
        ...prevStats,
        upcomingBookings: upcomingBookings.length,
        totalBookings: upcomingBookings.length + prevStats.pastBookings
      }));

    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      toast.error("Failed to load recent bookings");
      setUpcomingBookings([]);
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
      console.log("Fetching past bookings...");

      const response = await fetch("http://localhost:3000/api/admin/pastbookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Past Bookings API Response:", data);

      if (!data.success) {
        throw new Error("Failed to fetch past bookings");
      }

      // Ensure we're accessing the correct data structure
      const bookingsData = Array.isArray(data.data) ? data.data : [];
      console.log("Past Bookings Data:", bookingsData);

      const formattedBookings = bookingsData.map(booking => ({
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

      console.log("Formatted Past Bookings:", formattedBookings);
      setPastBookings(formattedBookings);

      // Update stats with the correct counts
      setStats(prevStats => {
        const pastCount = formattedBookings.length;
        const cancelledCount = formattedBookings.filter(b => b.status === 'cancelled').length;
        
        return {
          ...prevStats,
          pastBookings: pastCount,
          cancelledBookings: cancelledCount,
          totalBookings: pastCount + prevStats.upcomingBookings
        };
      });

    } catch (error) {
      console.error("Error fetching past bookings:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
      toast.error("Failed to load past bookings");
      setPastBookings([]);
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3000/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const users = data.users || data;
      
      const formattedUsers = users.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.created_at || new Date().toISOString(),
      }));

      setRecentUsers(formattedUsers);

      // Update total users count
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: formattedUsers.length
      }));

      // Process users for histogram
      const usersByMonth = formattedUsers.reduce((acc, user) => {
        const date = new Date(user.createdAt);
        const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});

      // Sort by date and convert to array
      const sortedMonths = Object.keys(usersByMonth).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      const trends = sortedMonths.map(month => ({
        month,
        count: usersByMonth[month]
      }));

      setUserTrends(trends);

    } catch (error) {
      console.error("Error fetching users:", error);
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

        {/* Booking Status Pie Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Booking Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              <Pie
                data={{
                  labels: ['Upcoming', 'Past', 'Cancelled'],
                  datasets: [
                    {
                      data: [
                        stats.upcomingBookings,
                        stats.pastBookings,
                        stats.cancelledBookings || 0
                      ],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.6)', // green
                        'rgba(59, 130, 246, 0.6)', // blue
                        'rgba(239, 68, 68, 0.6)', // red
                      ],
                      borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(239, 68, 68, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Users Histogram */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">User Registration Trend</h2>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: userTrends.map(trend => trend.month),
                  datasets: [
                    {
                      label: 'Users per Month',
                      data: userTrends.map(trend => trend.count),
                      backgroundColor: 'rgba(59, 130, 246, 0.6)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 1,
                      barPercentage: 1,
                      categoryPercentage: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                      title: {
                        display: true,
                        text: 'Number of Users'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Month'
                      },
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: 'User Registration Distribution by Month'
                    }
                  }
                }}
              />
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
                  {Array.isArray(recentUsers) && recentUsers.map((user) => (
                    <TableRow key={user.id}>
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