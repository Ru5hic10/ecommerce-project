import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "./CheckOutButton";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Divider,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = () => {
    if (selectedIndex !== null) {
      const updatedCart = cart.filter((_, index) => index !== selectedIndex);
      updateCart(updatedCart);
      setShowModal(false);
      setSelectedIndex(null);
    }
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + delta;
    if (updatedCart[index].quantity < 1) updatedCart[index].quantity = 1;
    updateCart(updatedCart);
  };


  const total = cart.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

  return (
    <Box display="flex" justifyContent="center" mt={4} minHeight="100vh">
      <Box width="100%" maxWidth="900px">
        <Typography variant="h4" gutterBottom>
          🛒 Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <ShoppingCartIcon color="disabled" sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              Your cart is empty.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse products and add something to your cart!
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            {cart.map((product, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={12} sm={3} textAlign="center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        maxHeight: "100px",
                        objectFit: "contain",
                        borderRadius: 8,
                        width: "100%",
                        maxWidth: "120px",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">
                      ₹{product.price} x {product.quantity || 1}
                    </Typography>

                    <Box mt={1} display="flex" alignItems="center" flexWrap="wrap">
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(index, -1)}
                        color="primary"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>

                      <Typography mx={2}>{product.quantity || 1}</Typography>

                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(index, 1)}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ ml: 3, mt: { xs: 1, sm: 0 } }}
                        startIcon={<RemoveIcon />}
                        onClick={() => {
                          setSelectedIndex(index);
                          setShowModal(true);
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                {index < cart.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}

            <Box textAlign="right" mt={3}>
              <Typography variant="h6">Total: ₹{total}</Typography>
              <CheckoutButton cartItems={cart} />
            </Box>
          </Paper>
        )}

        {/* Confirm Delete Dialog */}
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="remove-dialog-title"
          aria-describedby="remove-dialog-description"
        >
          <DialogTitle id="remove-dialog-title">Remove Item</DialogTitle>
          <DialogContent>
            <DialogContentText id="remove-dialog-description">
              Are you sure you want to remove this item from your cart?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleRemove} color="error" variant="contained">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CartPage;
