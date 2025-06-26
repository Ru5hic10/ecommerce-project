// src/components/CheckoutButton.jsx
import { loadStripe } from "@stripe/stripe-js";
import API from "../api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ cartItems }) => {
  const handleCheckout = async () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const formattedCart = cart.map(item => ({
    productId: item.id,
    quantity: item.quantity || 1, // default to 1 if quantity not present
  }));

  try {
    const res = await API.post("/payment/create-checkout-session", formattedCart);
    window.location.href = res.data.url;
   
  } catch (err) {
    console.error("Checkout failed", err);
    alert("Checkout failed. Please try again.");
  }
};
  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Proceed to Payment 💳
    </button>
  );
};

export default CheckoutButton;
