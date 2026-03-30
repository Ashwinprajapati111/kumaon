import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const API = "http://localhost:5000/api/orders";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ===========================
   ROW COMPONENT (OPTIMIZED)
=========================== */

const OrderRow = React.memo(
  ({ order, statusMap, setStatusMap, handleStatusUpdate, handleDelete, generateInvoice }) => {
    const selectedStatus = statusMap[order._id] || order.orderStatus;

    return (
      <tr>
        {/* CUSTOMER */}
        <td className="p-3 border">
          {order.customer?.firstName} {order.customer?.lastName}
          <div>{order.customer?.email}</div>
        </td>
        {/* ORDER DETAILS */}
        <td className="p-3 border">
          <div className="flex flex-col gap-3 max-h-40 overflow-y-auto">
            {order.cart?.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 border-b pb-2 items-center"
              >
                {/* IMAGE */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}

                {/* INFO */}
                <div className="text-sm">
                  <div className="font-semibold">{item.productName}</div>

                  <div className="text-gray-600">
                    ₹{item.price} × {item.quantity}
                  </div>
                  <p className="text-gray-600">
                    {item.name}
                  </p>

                  <div className="text-green-600 font-medium">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </td>

        {/* SHIPPING */}
        <td className="p-3 border">
          <div>{order.customer?.address}</div>
          <div>{order.customer?.city}</div>
          <div>{order.customer?.phone}</div>
        </td>

        {/* TOTAL */}
        <td className="p-3 border">₹{order.total}</td>

        {/* PAYMENT */}
        <td className="p-3 border text-sm">
          <div>
            Status:
            <span
              className={
                order.payment?.paymentStatus === "Paid"
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {" "}
              {order.payment?.paymentStatus}
            </span>
          </div>

          <div>ID: {order.payment?.paymentId || "N/A"}</div>
          <div>OrderID: {order.payment?.razorpayOrderId || "N/A"}</div>
        </td>

        {/* ORDER STATUS */}
        <td className="p-3 border">
          <div className="flex flex-col gap-2 text-sm">
            {["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"].map(
              (step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${order.orderStatus === step
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                  <span>{step}</span>
                </div>
              )
            )}
          </div>
        </td>

        {/* CHANGE STATUS */}
        <td className="p-4 border">
          <div className="flex flex-col gap-3">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setStatusMap((prev) => ({
                  ...prev,
                  [order._id]: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            <button
              onClick={() => handleStatusUpdate(order)}
              disabled={selectedStatus === order.orderStatus}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition
                ${selectedStatus === order.orderStatus
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
            >
              Change Status
            </button>
          </div>
        </td>

        <td className="p-3 border">
          <button
            onClick={() => generateInvoice(order)}
            title="Download Invoice"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </td>
        {/* ACTION */}
        <td className="p-3 border">
          <button
            onClick={() => handleDelete(order._id)}
            className="text-red-600"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    );
  }
);
const generateInvoice = (order) => {
  const doc = new jsPDF();

  /* ===== LOGO ===== */
  const logo = "/images/logo.png";
  const signature = "/images/signature.png";
  doc.addImage(logo, "PNG", 150, 10, 40, 30);

  /* ===== COMPANY ===== */
  doc.setFontSize(16);
  doc.text("Kumaon Organic", 14, 20);

  doc.setFontSize(10);
  doc.text("Himalaya, Gujarat, India", 14, 26);
  doc.text("GSTIN: 24ABCDE1234F1Z5", 14, 32);

  /* ===== INVOICE TITLE ===== */
  doc.setFontSize(18);
  doc.text("INVOICE", 14, 45);

  /* ===== CUSTOMER ===== */
  doc.setFontSize(10);
  doc.text(`Name: ${order.customer?.firstName} ${order.customer?.lastName}`, 14, 55);
  doc.text(`Phone: ${order.customer?.phone}`, 14, 61);
  doc.text(`Address: ${order.customer?.address}`, 14, 67);

  /* ===== ORDER INFO ===== */
  doc.text(`Order ID: ${order._id}`, 140, 55);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 61);

  /* ===== TABLE ===== */
  const rows = order.cart.map((item) => [
    item.productName || item.name,
    item.quantity,
    `Rs ${item.price}`,
    `Rs ${item.price * item.quantity}`,
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["Product", "Qty", "Price", "Subtotal"]],
    body: rows,
  });

  /* ===== TOTAL ===== */
  let finalY = doc.lastAutoTable.finalY + 10;

  const gst = order.total * 0.18;

  doc.text(`Subtotal: Rs ${order.total}`, 140, finalY);
  doc.text(`GST (18%): Rs ${gst.toFixed(2)}`, 140, finalY + 6);

  doc.setFontSize(12);
  doc.text(`Grand Total: Rs ${(order.total + gst).toFixed(2)}`, 140, finalY + 14);

  /* ===== FOOTER ===== */
  doc.setFontSize(10);
  doc.text("Authorized Signature", 14, finalY + 30);
  doc.addImage(signature, "JPG", 12, 130, 40, 20);

  doc.save(`Invoice_${order._id}.pdf`);
};
/* ===========================
   MAIN COMPONENT
=========================== */
export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API}/getall`, getAuthConfig());
    setOrders(res.data.orders || []);
  } catch (error) {
    console.error("FULL ERROR:", error.response || error);
    toast.error("Failed to load orders");
  }
};
  const filteredOrders = orders.filter((order) => {
    const name = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.toLowerCase();
    const email = order.customer?.email?.toLowerCase() || "";
    const city = order.customer?.city?.toLowerCase() || "";
    const address = order.customer?.address?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    const matchesSearch =
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      city.includes(searchValue) ||        // ✅ added
      address.includes(searchValue);       // ✅ added

    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 📄 PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium">
          Are you sure you want to delete this order?
        </span>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const loading = toast.loading("Deleting...");

              try {
                await axios.delete(`${API}/delete/${id}`, getAuthConfig());

                toast.success("Order deleted 🗑️", { id: loading });

                fetchOrders();
              } catch (error) {
                toast.error("Delete failed ❌", { id: loading });
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  /* ================= STATUS UPDATE ================= */
const handleStatusUpdate = (order) => {
  const newStatus = statusMap[order._id] || order.orderStatus;

  if (newStatus === order.orderStatus) {
    toast("No change in status");
    return;
  }

  toast((t) => (
    <div className="flex flex-col gap-2">
      <span>Change status to "{newStatus}"?</span>

      <div className="flex gap-2 justify-end">
        <button
          className="bg-gray-300 px-2 py-1 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>

        <button
          className="bg-blue-600 text-white px-2 py-1 rounded"
          onClick={async () => {
            toast.dismiss(t.id);

            const loading = toast.loading("Updating...");

            try {
              // 🔴 IF CANCELLED → CALL CANCEL API
              if (newStatus === "Cancelled") {
                await axios.put(
                  `${API}/cancel/${order._id}`,
                  {},
                  getAuthConfig()
                );
              } 
              // 🔵 OTHERWISE NORMAL STATUS UPDATE
              else {
                await axios.put(
                  `${API}/status/${order._id}`,
                  { orderStatus: newStatus },
                  getAuthConfig()
                );
              }

              toast.success("Status updated ✅", { id: loading });

              fetchOrders();
            } catch (error) {
              console.error(error);
              toast.error("Update failed ❌", { id: loading });
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  ));
};
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Orders Admin
        </h1>

        <span className="text-sm text-gray-500">
          Total Orders: <b>{orders.length}</b>
        </span>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, email, city, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl"
        >
          <option value="All">All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Shipped</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Order Details</th>
              <th className="p-3 border">Shipping</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Order Status</th>
              <th className="p-3 border">Change Status</th>
              <th className="p-3 border">Invoice</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                statusMap={statusMap}
                setStatusMap={setStatusMap}
                handleStatusUpdate={handleStatusUpdate}
                handleDelete={handleDelete}
                generateInvoice={generateInvoice}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD ================= */}
      {/* ================= MOBILE CARD ================= */}
      <div className="lg:hidden flex flex-col gap-4">
        {currentOrders.map((order) => {
          const selectedStatus = statusMap[order._id] || order.orderStatus;

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-4 space-y-4"
            >
              {/* TOP */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.email}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* PRODUCTS */}
              <div className="text-sm text-gray-600">
                {order.cart?.map((item, i) => (
                  <div key={i}>
                    {item.productName} × {item.quantity}
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              <div className="text-sm text-gray-500">
                {order.customer?.address}, {order.customer?.city}
              </div>

              {/* TOTAL */}
              <div className="font-semibold text-lg">₹{order.total}</div>

              {/* ================= CHANGE STATUS (NEW) ================= */}
              <div className="flex flex-col gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setStatusMap((prev) => ({
                      ...prev,
                      [order._id]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>

                <button
                  onClick={() => handleStatusUpdate(order)}
                  disabled={selectedStatus === order.orderStatus}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold
              ${selectedStatus === order.orderStatus
                      ? "bg-gray-200 text-gray-400"
                      : "bg-yellow-500 text-white"
                    }`}
                >
                  Update Status
                </button>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center pt-2 border-t">
                <button
                  onClick={() => generateInvoice(order)}
                  className="text-blue-600 flex items-center gap-1"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Invoice
                </button>

                <button
                  onClick={() => handleDelete(order._id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg border ${currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}