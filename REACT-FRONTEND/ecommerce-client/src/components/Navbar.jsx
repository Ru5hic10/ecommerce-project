import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Badge,
  Divider
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InventoryIcon from "@mui/icons-material/Inventory";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const token = sessionStorage.getItem("jwtToken");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cartItems.length);
  }, [location]); // updates count on route change

  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#212529" }}>
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleMenuOpen}
          sx={{ display: { sm: "none" }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to={token ? "/products" : "/"}
          sx={{
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          🛒 E-Shop
        </Typography>
            <Button
              color="inherit"
              startIcon={<InventoryIcon />}
              component={Link}
              to="/products"
            >
              Products
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/cart"
              startIcon={
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Cart
            </Button>
        {/* Desktop Navigation */}
        {token ? (
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, mr: 3 }}>
            

            {user?.roles?.includes("ADMIN") && (
              <Button
                color="warning"
                startIcon={<AddIcon />}
                component={Link}
                to="/admin/add-product"
              >
                Add Product
              </Button>
            )}

            

            <Button color="inherit" component={Link} to="/orders">
              My Orders
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={location.pathname === "/login" ? "contained" : "outlined"}
              color="primary"
              size="small"
              startIcon={<LoginIcon />}
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant={location.pathname === "/register" ? "contained" : "outlined"}
              color="primary"
              size="small"
              startIcon={<PersonAddIcon />}
              component={Link}
              to="/register"
            >
              Register
            </Button>
          </Box>
        )}

        {/* Logout Button */}
        {token && (
          <Button
            color="error"
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>

      {/* Mobile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ display: { sm: "none" } }}
      >
        {token
  ? [
      <MenuItem key="products" component={Link} to="/products" onClick={handleMenuClose}>
        Products
      </MenuItem>,
      user?.roles?.includes("ADMIN") && (
        <MenuItem key="add" component={Link} to="/admin/add-product" onClick={handleMenuClose}>
          Add Product
        </MenuItem>
      ),
      <MenuItem key="cart" component={Link} to="/cart" onClick={handleMenuClose}>
        Cart
      </MenuItem>,
      <MenuItem key="orders" component={Link} to="/orders" onClick={handleMenuClose}>
        My Orders
      </MenuItem>,
      <Divider key="divider" />,
      <MenuItem key="logout" onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
      </MenuItem>
    ]
  : [
      <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>
        <LoginIcon fontSize="small" sx={{ mr: 1 }} /> Login
      </MenuItem>,
      <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose}>
        <PersonAddIcon fontSize="small" sx={{ mr: 1 }} /> Register
      </MenuItem>,
      <MenuItem key="products" component={Link} to="/products" onClick={handleMenuClose}>
        Products
      </MenuItem>,
      <MenuItem key="cart" component={Link} to="/cart" onClick={handleMenuClose}>
        Cart
      </MenuItem>
    ]}

      </Menu>
    </AppBar>
  );
};

export default Navbar;
