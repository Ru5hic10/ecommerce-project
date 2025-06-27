import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = sessionStorage.getItem("jwtToken");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to={token ? "/products" : "/"}>
        🛒 E-Shop
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>

              {user?.roles?.includes("ADMIN") && (
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin/add-product">
                    Add Product
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  Cart
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  My Orders
                </Link>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav">
          {token ? (
            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link
                  className={`btn btn-sm me-2 ${
                    location.pathname === "/login" ? "btn-primary" : "btn-outline-light"
                  }`}
                  to="/login"
                >

                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`btn btn-sm me-2 ${
                    location.pathname === "/register" ? "btn-primary" : "btn-outline-light"
                  }`}
                  to="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
