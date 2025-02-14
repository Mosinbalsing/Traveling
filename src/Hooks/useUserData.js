import { useState, useEffect } from 'react';
import { authAPI } from '@/config/api';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await authAPI.getUserData(token);
        setUserData(userData);

        const carData = await fetchCarDetails();
        setCarDetails(carData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, carDetails, loading, error };
};

const fetchCarDetails = async () => {
  return {
    carName: 'Example Car',
    carImage: 'example-car.jpg',
    carFeatures: ['Feature 1', 'Feature 2']
  };
}; 