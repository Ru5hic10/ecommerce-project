import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Grid,
  Chip,
  Divider
} from "@mui/material";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        alert("❌ You are not authorized to view this page.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>Fetching your orders...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        📦 My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography align="center" variant="body1" color="text.secondary">
          You have no orders yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
        <Grid item xs={12} key={order.id}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box mb={1} display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">Order ID: {order.id}</Typography>
            <Chip label={order.status} color="success" size="small" />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 1 }} />
          {order.items.map((item, idx) => (
            <Box key={idx} display="flex" alignItems="center" mb={2}>
              <img
                src={item.imageUrl}
                alt={item.productName}
                style={{ width: 80, height: 80, objectFit: "contain", marginRight: 16 }}
              />
              <Box>
                <Typography variant="subtitle1">{item.productName}</Typography>
                <Typography variant="body2">
                  ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </Typography>
              </Box>
            </Box>
          ))}

          <Divider sx={{ mt: 2, mb: 1 }} />
          <Typography variant="body1">
            <strong>Total:</strong> ₹{order.amount}
          </Typography>
        </Paper>
      </Grid>

))}

        </Grid>
      )}
    </Container>
  );
};

export default MyOrders;
