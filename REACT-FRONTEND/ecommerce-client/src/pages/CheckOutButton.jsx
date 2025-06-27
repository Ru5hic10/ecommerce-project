import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import API from "../api/axios";
import { Spinner } from "react-bootstrap";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ cartItems }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const formattedCart = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity || 1,
    }));

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // show spinner

      const res = await API.post("/payment/create-checkout-session", formattedCart);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout failed", err);
      alert("❌ Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="btn btn-success mt-3 w-100"
      disabled={loading}
    >
      {loading ? (
        <span>
          <Spinner animation="border" size="sm" className="me-2" />
          Redirecting to Stripe...
        </span>
      ) : (
        "Proceed to Payment 💳"
      )}
    </button>
  );
};

export default CheckoutButton;
