import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { authAPI } from "@/config/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
        const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

        console.log("Dashboard Auth Check:", { isAuthenticated, isLoggedIn });

        if (!isAuthenticated || !isLoggedIn) {
          throw new Error("Not authenticated");
        }

        // Only try to fetch admin data if authenticated
        const token = localStorage.getItem("adminToken");
        if (token) {
          const response = await authAPI.getAdminData(token);
          if (response.success) {
            setAdminData(response.data);
          }
        }
      } catch (error) {
        console.error("Auth Error:", error);
        // Use window.location for hard redirect
        window.location.href = "/admin/login";
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    navigate("/", { replace: true });
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard content here */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Welcome, {adminData?.name}</h2>
          {/* Add more dashboard widgets */}
        </div>
      </div>
    </div>
  );
} 