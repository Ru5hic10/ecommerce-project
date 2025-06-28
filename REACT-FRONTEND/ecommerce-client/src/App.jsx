import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Home from "./pages/Home";
import AddProductPage from "./pages/AddProduct";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import MyOrders from "./pages/MyOrders";

const PrivateRouteForProduct = ({ children }) => {
  const token = sessionStorage.getItem("jwtToken");
  return token ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
              <Products />
          }
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/admin/add-product" element={<AddProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
