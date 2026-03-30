import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Admin() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-5 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>

        <Link to="/admin/addproducts" className="block hover:text-gray-300">Add Products</Link>
        <Link to="/admin/orders" className="block hover:text-gray-300">Orders</Link>
        <Link to="/admin/admin_users" className="block hover:text-gray-300">Users</Link>
        <Link to="/admin/contacts" className="block hover:text-gray-300">Contacts</Link>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Welcome Admin 👑</h1>

        <div className="bg-white p-6 rounded shadow">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>
    </div>
  );
}