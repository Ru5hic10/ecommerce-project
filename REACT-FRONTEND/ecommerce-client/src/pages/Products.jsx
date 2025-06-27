import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Backdrop,
  Container,
} from "@mui/material";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", severity: "success" });
  const [editLoading, setEditLoading] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setToast({ show: true, message: "Failed to load products", severity: "error" });
      });
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    setToast({ show: true, message: "✅ Product added to cart!", severity: "success" });
  };

  const handleDelete = async () => {
    try {
      setEditLoading(true);
      await API.delete(`/products/${productToDelete.id}`);
      setToast({ show: true, message: "🗑️ Product removed", severity: "warning" });
      setProducts(products.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      console.error("Delete failed", err);
      setToast({ show: true, message: "❌ Failed to delete", severity: "error" });
    } finally {
      setShowConfirm(false);
      setEditLoading(false);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleEdit = (product) => {
    setEditLoading(true);
    setTimeout(() => {
      navigate("/admin/add-product", { state: { product } });
    }, 500);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🍭 Product List
      </Typography>

      {products.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No products available
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  image={product.imageUrl}
                  alt={product.name}
                  height="200"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1" color="success.main" sx={{ mt: 1 }}>
                    ₹{product.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Button variant="contained" size="small" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                  {user?.roles?.includes("ADMIN") && (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => confirmDelete(product)}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={toast.show}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, show: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, show: false })}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop open={editLoading} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Products;
