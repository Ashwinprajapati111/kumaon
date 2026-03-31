import "./App.css";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ScrollToTop from "./pages/ScrollToTop";

/* ================= COMPONENTS ================= */
import Contact from "./Component/Contact";
import Home from "./Component/Home";
import Products from "./Component/Products";
import Aboutus from "./Component/Aboutus";

import Product_details from "./Component/Products/Product_details";
import Cart from "./Component/Products/Cart";
import Checkout from "./Component/Products/Checkout";
import Payment from "./Component/Products/Payment";
import OrderSuccess from "./Component/Products/OrderSuccess";

import BlogList from "./Component/Blog/BlogList";
import BlogDetails from "./Component/Blog/BlogDetails";

import Eventsphoto from "./Component/Gallery/Eventsphoto";

import PhotoDetails from "./Component/Gallery/PhotoDetails";
import VideoDetails from "./Component/Gallery/VideoDetails";

/* ================= AUTH ================= */
import Userlogin from "./pages/User.login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Forgot";
import ResetPassword from "./pages/Reset";

/* ================= DASHBOARD ================= */
import Dashboard from "./pages/User.Dashboard";
import UserHistory from "./pages/User.History";

/* ================= ADMIN ================= */
import Admin from "./Admin/Admin";
import AdminLogin from "./pages/Admin.login";
import AdminRegister from "./pages/Admin.Register";
import AddProducts from "./Admin/AddProducts";
import AddPhotos from "./Admin/AddPhotos";
import AddGallerys from "./Admin/AddGallerys";
import AddVideos from "./Admin/AddVideos";
import AddSlider from "./Admin/Addsliders";
import AddBlogs from "./Admin/AddBlogs";
import Orders from "./Admin/Orders";
import Admin_users from "./Admin/Admin_users";
import Users from "./Admin/Users";
import AddInsta from "./Admin/Admin_instas";
import Contacts from "./Admin/Contacts";
import AdminDashboard from "./Admin/Orders";
import Unused_photos from "./Admin/Unused_photos";

/* ================= PROTECTED ================= */
import ProtectedRoute from "./redux/ProtectedRoute";

function App() {
  const { user } = useSelector((state) => state.auth);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aboutus" element={<Aboutus />} />

        {/* ================= USER AUTH ================= */}
        <Route
          path="/register"
          element={currentUser ? (
            <Navigate
              to={currentUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}
              replace
            />
          ) : (
            <Register />
          )}
        />

        <Route
          path="/user-login"
          element={currentUser ? (
            <Navigate
              to={currentUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}
              replace
            />
          ) : (
            <Userlogin />
          )}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= ADMIN AUTH ================= */}
        <Route
          path="/admin/login"
          element={currentUser?.role === "admin" ? (
            <Navigate to="/admin-dashboard" replace />
          ) : (
            <AdminLogin />
          )}
        />

        <Route path="/admin/register" element={<AdminRegister />} />

        {/* ================= DASHBOARDS ================= */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-History"
          element={
            <ProtectedRoute role="user">
              <UserHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={currentUser?.role === "admin" ? (
            <Navigate to="/admin-dashboard" replace />
          ) : (
            <Navigate to="/admin/login" replace />
          )}
        />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add-products" element={<ProtectedRoute role="admin"><AddProducts /></ProtectedRoute>} />
        <Route path="/admin/add-photos" element={<ProtectedRoute role="admin"><AddPhotos /></ProtectedRoute>} />
        <Route path="/admin/add-videos" element={<ProtectedRoute role="admin"><AddVideos /></ProtectedRoute>} />
        <Route path="/admin/add-gallery" element={<ProtectedRoute role="admin"><AddGallerys /></ProtectedRoute>} />
        <Route path="/admin/add-sliders" element={<ProtectedRoute role="admin"><AddSlider /></ProtectedRoute>} />
        <Route path="/admin/add-blogs" element={<ProtectedRoute role="admin"><AddBlogs /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="admin"><Orders /></ProtectedRoute>} />
        <Route path="/admin/add-insta" element={<ProtectedRoute role="admin"><AddInsta /></ProtectedRoute>} />
        <Route path="/admin/admin-users" element={<ProtectedRoute role="admin"><Admin_users /></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute role="admin"><Contacts /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
        <Route path="/admin/unused_photos" element={<ProtectedRoute role="admin"><Unused_photos /></ProtectedRoute>} />

        {/* ================= GALLERY ================= */}
        <Route path="/events-photo" element={<Eventsphoto />} />
      
        <Route path="/photo/:id" element={<PhotoDetails />} />
        <Route path="/video/:id" element={<VideoDetails />} />

        {/* ================= PRODUCTS ================= */}
        <Route path="/Product_details/:id" element={<Product_details />} />
        <Route path="/Product/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute role="user"><Checkout /></ProtectedRoute>} />
        <Route path="/payment" element={<Payment />} />

        {/* ================= BLOG ================= */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetails />} />

        {/* ================= ORDER ================= */}
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={
            currentUser
              ? <Navigate
                to={currentUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}
                replace
              />
              : <Navigate to="/user-login" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;