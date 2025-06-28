import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ cartItems }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "error" });
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length === 0) {
      return setToast({ open: true, message: "🛒 Your cart is empty!", severity: "warning" });
    }
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      sessionStorage.setItem("postLoginRedirect", "/cart");
      sessionStorage.setItem("showLoginToast", "true");
      navigate("/login");
    }

    const formattedCart = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity || 1,
    }));

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated loading

      const res = await API.post("/payment/create-checkout-session", formattedCart);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout failed", err);
      setToast({ open: true, message: "❌ Checkout failed. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleCheckout}
        disabled={loading}
        size="large"
        sx={{ mt: 2 }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ color: "white", mr: 2 }} />
            Redirecting to Stripe...
          </>
        ) : (
          "Proceed to Payment 💳"
        )}
      </Button>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CheckoutButton;
