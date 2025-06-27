import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", severity: "error" });

  const validateField = (name, value) => {
    if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;

    switch (name) {
      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email address";
      case "password":
        return value.length >= 6 ? "" : "Password must be at least 6 characters";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const showToast = (message, severity = "error") => {
    setToast({ show: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const field in form) {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return showToast("Please fix the form errors.");
    }

    setLoading(true);
    try {
      await API.post("/auth/register", form);
      showToast("✅ Registered successfully. Redirecting...", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast("❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              startIcon={!loading && <PersonAddIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Register"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={toast.show}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, show: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

export default Register;
