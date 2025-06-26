import { useEffect } from "react";
import API from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentSuccess = query.get("success");

    if (paymentSuccess === "true") {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
      const productNames = cart.map((item) => item.name);

      API.post("/orders", {
        products: productNames,
        amount: totalAmount,
      })
        .then(() => {
          console.log("Order saved");
          localStorage.removeItem("cart"); // ✅ clear cart after order saved
        })
        .catch((err) => {
          console.error("Failed to save order", err);
        });
    }
  }, [location]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold text-green-600">🎉 Payment Successful!</h2>
      <p>Your order has been placed successfully.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Home
      </button>
    </div>
  );
};

export default CheckoutSuccess;
