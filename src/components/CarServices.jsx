import React from 'react';

const CarServices = () => {
  const routes = [
    { from: "Pune", to: "Shirdi", price: 3500 },
    { from: "Pune", to: "Mahabaleshwar", price: 3000 },
    { from: "Pune", to: "Lonavala", price: 2500 },
    { from: "Pune", to: "Mumbai", price: 2800 },
    { from: "Pune", to: "Nashik", price: 3200 },
    { from: "Pune", to: "Kolhapur", price: 4200 },
    { from: "Pune", to: "Ahmednagar", price: 2500 },
    { from: "Pune", to: "Aurangabad", price: 3800 },
  ];

  return (
    <div className="price-list-container">
      <div className="header">
        <h1>BEST ONE WAY TAXI PRICES</h1>
        <p>For a one-way trip, pay for only one way.</p>
      </div>

      <div className="routes-container">
        {routes.map((route, index) => (
          <div key={index} className="route-item">
            <div className="route-details">
              <span className="route-name">{`${route.from} to ${route.to}`}</span>
              <span className="price">₹{route.price}*</span>
            </div>
          </div>
        ))}
      </div>

      <div className="footer">
        <p className="disclaimer">* Indicative prices, it may vary</p>
        <div className="logo">श्री टूर्स अँड ट्रॅव्हल्स</div>
      </div>

      <style>{`
        .price-list-container {
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Arial', sans-serif;
          background: #ffffff;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: fadeIn 1s ease-in-out;
        }

        .header {
          background: linear-gradient(135deg, #ffc107, #ff9800);
          padding: 30px 20px;
          text-align: center;
          animation: slideDown 0.8s ease-out;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #fff;
        }

        .header p {
          margin: 10px 0 0;
          font-size: 16px;
          color: #fff;
        }

        .routes-container {
          padding: 20px;
          background: #f9f9f9;
        }

        .route-item {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s forwards ease-out;
        }

        .route-item:nth-child(even) {
          animation-delay: 0.2s;
        }

        .route-item:nth-child(odd) {
          animation-delay: 0.4s;
        }

        .route-item:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .route-details {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .route-name {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }

        .price {
          font-size: 16px;
          font-weight: bold;
          color: #ff9800;
        }

        .footer {
          background: #2a2a40;
          padding: 20px;
          text-align: center;
        }

        .disclaimer {
          font-size: 12px;
          color: #888;
        }

        .logo {
          margin-top: 10px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 24px;
          }

          .route-item {
            font-size: 14px;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .route-item:hover {
          transform: scale(1.05) !important;
          transition: transform 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CarServices;
