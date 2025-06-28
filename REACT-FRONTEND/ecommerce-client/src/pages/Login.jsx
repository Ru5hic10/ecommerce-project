import { useState, useEffect } from "react";
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
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", severity: "error" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Live validation
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      setErrors(prev => ({ ...prev, email: "Invalid email address" }));
    } else {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const showToast = (message, severity = "error") => {
    setToast({ show: true, message, severity });
    setTimeout(() => setToast({ show: false, message: "", severity: "error" }), 3000);
  };

  useEffect(() => {
    if (sessionStorage.getItem("showLoginToast")) {
      setToast({ show: true, message: "🔒 Please login to proceed to checkout", severity: "info" });
      sessionStorage.removeItem("showLoginToast");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return showToast("Both fields are required");
    }

    if (errors.email) return showToast("Please correct the form");

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await API.post("/auth/login", form);
      const { token, user } = response.data;

      if (token && user) {
        sessionStorage.setItem("jwtToken", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        showToast("✅ Logged in successfully!", "success");
        const redirectTo = sessionStorage.getItem("postLoginRedirect") || "/products";
        sessionStorage.removeItem("postLoginRedirect");

        setTimeout(() => navigate(redirectTo), 1000);
      } else {
        showToast("Something went wrong!");
      }
    } catch (err) {
      showToast("Login failed. Check your email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Login to Your Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
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
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !form.email || !form.password}
              sx={{ mt: 2 }}
              startIcon={loading ? null : <LockIcon />}
            >
              {loading ? <CircularProgress size={20} /> : "Login"}
            </Button>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={toast.show}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, show: false })}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
