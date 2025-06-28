import { useEffect } from "react";
import API from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Alert,
  Container,
  Paper,
} from "@mui/material";

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentSuccess = query.get("success");

    if (paymentSuccess === "true") {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
      const productItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1
      }));
      API.post("/orders", {
        products: productItems,
        amount: totalAmount,
      })
        .then(() => {
          console.log("✅ Order saved");
          localStorage.removeItem("cart");
        })
        .catch((err) => {
          console.error("❌ Failed to save order", err);
        });
    } else {
      navigate("/cart"); 
      return;
      }
  }, [location]);

  return (
    <Container maxWidth="sm">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Alert severity="success" variant="filled">
            <Typography variant="h5" gutterBottom>
              🎉 Payment Successful!
            </Typography>
            <Typography variant="body1">
              Your order has been placed successfully. Thank you for shopping with us!
            </Typography>
          </Alert>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => navigate("/products")}
          >
            See More Products
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutSuccess;
