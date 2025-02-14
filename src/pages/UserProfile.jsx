import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/config/api';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_ENDPOINTS } from '@/config/api';

const UserProfile = ({ userData }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/log');
    };

    if (!userData) {
        return <p>No user data available</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">@{userData.username}</p>
                            </div>
                            <Button variant="destructive" onClick={handleLogout}>
                                Logout
                            </Button>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                                <p className="text-base">{userData.username}</p>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p className="text-base">{userData.email}</p>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Mobile</h3>
                                <p className="text-base">{userData.mobile}</p>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                                <p className="text-base">
                                    {new Date(userData.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">No recent bookings found.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
