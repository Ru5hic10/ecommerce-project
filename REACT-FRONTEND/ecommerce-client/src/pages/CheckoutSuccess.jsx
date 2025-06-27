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
          console.log("✅ Order saved");
          localStorage.removeItem("cart");
        })
        .catch((err) => {
          console.error("❌ Failed to save order", err);
        });
    }
  }, [location]);

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <div className="alert alert-success w-100 text-center" role="alert">
        <h4 className="alert-heading">🎉 Payment Successful!</h4>
        <p>Your order has been placed successfully. Thank you for shopping with us!</p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="btn btn-primary mt-3"
      >
        Go to Home 🏠
      </button>
    </div>
  );
};

export default CheckoutSuccess;
