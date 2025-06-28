import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  MenuItem,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product;

  const categories = [
    "electronics",
    "mens-clothing",
    "womens-clothing",
    "shoes",
    "kitchen"
  ];

  useEffect(() => {
    if (editProduct) {
      setProduct(editProduct);
      setImagePreview(editProduct.imageUrl);
      setIsEditing(true);
    }
  }, [editProduct]);

  const validate = () => {
    const errs = {};
    if (!product.name) errs.name = "Product name is required";
    if (!product.description) errs.description = "Description is required";
    if (!imageFile && !product.imageUrl) errs.imageUrl = "Product image is required";
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0) {
      errs.price = "Price must be a positive number";
    }
    if (!product.category) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showToast = (message, severity = "success") => {
    setToast({ show: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let uploadedImageUrl = product.imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await API.post("/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImageUrl = uploadRes.data;
      }

      const payload = { ...product, imageUrl: uploadedImageUrl };

      if (isEditing) {
        await API.put(`/products/${product.id}`, payload);
        showToast("✅ Product updated successfully!");
      } else {
        await API.post("/products", payload);
        showToast("✅ Product added successfully!");
        setProduct({ name: "", description: "", price: "", imageUrl: "", category: "" });
        setImagePreview("");
        setPreviewUrl(null);
        setImageFile(null);
      }

      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to submit. Unauthorized or error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("❌ Only image files allowed", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast("❌ Image must be under 2MB", "error");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImagePreview(""); // clear previous image if uploading new
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setImagePreview("");
    setProduct((prev) => ({ ...prev, imageUrl: "" }));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          {isEditing ? "Edit Product" : "Add New Product"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <fieldset disabled={loading} style={{ border: 0, padding: 0, margin: 0 }}>
            <TextField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              autoFocus
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <TextField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={Boolean(errors.description)}
              helperText={errors.description}
            />

            <TextField
              label="Price (₹)"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={Boolean(errors.price)}
              helperText={errors.price}
            />

            <TextField
              label="Category"
              name="category"
              select
              value={product.category}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={Boolean(errors.category)}
              helperText={errors.category}
            >
              <MenuItem value="" disabled>Select Category</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.replace("-", " ").toUpperCase()}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>

            {(previewUrl || imagePreview) && (
              <Box mt={2} textAlign="center" position="relative">
                <img
                  src={previewUrl || imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: 200, objectFit: "contain" }}
                />
                <IconButton
                  size="small"
                  onClick={clearImage}
                  sx={{ position: "absolute", top: 0, right: 0, bgcolor: "white" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {errors.imageUrl && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.imageUrl}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : isEditing ? "Update Product" : "Add Product"}
            </Button>
          </fieldset>
        </Box>
      </Paper>

      <Snackbar
        open={toast.show}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, show: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, show: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProductPage;
