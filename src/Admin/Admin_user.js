import toast, { Toaster } from "react-hot-toast";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { FaTrash, FaPlus, FaEye, FaUsers } from "react-icons/fa";
import "./Mycss.css";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const formRef = useRef(null);

  // 🔹 FORM STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 DATA
  const [SeData, setSeData] = useState([]);

  // 🔹 UI
  const [filterYear, setFilterYear] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [mycurrentPage, setmyCurrentPage] = useState(1);
  const [tab, setTab] = useState(2);

  const itemsPerPage = 5;

  // 🔹 FETCH DATA
  const showdata = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/user/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSeData(res.data.reverse());
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      toast.error("Failed to load admin data ❌");
    }
  };

  useEffect(() => {
    showdata();
  }, []);

  // 🔹 ADD ADMIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/user/", // fixed URL
        {
          name,
          email,
          mobile,
          password,
          role: "admin",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Admin user added successfully ✅");

      setName("");
      setEmail("");
      setMobile("");
      setPassword("");

      showdata();
    } catch (error) {
      console.log("ADD ADMIN ERROR:", error.response?.data || error.message);
      toast.error("Error adding admin user ❌");
    }
  };

  // 🔹 DELETE WITH TOAST CONFIRM
  const deleteSlider = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-sm">Delete this admin user?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await axios.delete(
                  `http://localhost:5000/user/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                toast.dismiss(t.id);
                toast.success("Deleted successfully 🗑️");
                showdata();
              } catch (err) {
                toast.dismiss(t.id);
                toast.error("Delete failed ❌");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  // 🔹 YEARS
  const myyears = [
    ...new Set(SeData.map((g) => new Date(g.createdAt).getFullYear())),
  ];

  // 🔹 FILTER + SORT
  const myfilteredData = useMemo(() => {
    let data = [...SeData];

    if (filterYear !== "All") {
      data = data.filter(
        (g) =>
          new Date(g.createdAt).getFullYear() === Number(filterYear)
      );
    }

    data.sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return data;
  }, [SeData, filterYear, sortOrder]);

  // 🔹 PAGINATION
  const indexOfLastItem = mycurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const mytotalPages = Math.ceil(myfilteredData.length / itemsPerPage);

  const mypaginatedData = myfilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  useEffect(() => {
    console.log("TOKEN:", localStorage.getItem("token"));
    showdata();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-amber-200">
                Admin Dashboard
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Admin Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Add, view, search, edit and manage Admin
              </p>
            </div>

            {/* Animated Tabs */}
            <div className="mb-8 flex justify-center">
              <div className="relative inline-flex rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200">
                <div
                  className={classNames(
                    "absolute top-2 bottom-2 w-[calc(50%-0.25rem)] rounded-xl bg-amber-400 transition-all duration-300",
                    tab === 1 ? "left-2" : "left-[calc(50%)]"
                  )}
                />
                <button
                  onClick={() => setTab(1)}
                  className={classNames(
                    "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                    tab === 1 ? "text-slate-900" : "text-slate-600"
                  )}
                >
                  <FaPlus />
                  Add Admin
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={classNames(
                    "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                    tab === 2 ? "text-slate-900" : "text-slate-600"
                  )}
                >
                  <FaEye />
                  View Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ADD USER */}
        {tab === 1 && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Admin</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border rounded-xl px-4 py-2"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border rounded-xl px-4 py-2"
              />

              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile"
                className="w-full border rounded-xl px-4 py-2"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border rounded-xl px-4 py-2"
              />

              <button className="w-full bg-amber-400 py-2 rounded-xl font-semibold">
                Submit
              </button>
            </form>
          </div>
        )}

        {/* VIEW USERS */}
        {tab === 2 && (
          <div className="bg-white p-6 rounded-3xl shadow-xl">

            {/* FILTER */}
            <div className="flex gap-3 mb-6">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="border px-4 py-2 rounded-xl"
              >
                <option value="All">All Years</option>
                {myyears.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border px-4 py-2 rounded-xl"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
              
            </div>
            <div className="mb-8 flex justify-left">
                <div className="relative inline-flex items-center gap-2 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200">
                  <FaUsers className="text-amber-400 text-xl" />
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    Total Admins: {SeData.length}
                  </span>
                </div>
              </div>

            {/* TABLE */}
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Password</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {mypaginatedData.map((item, index) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3 text-center">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-3 text-left">{item.name}</td>
                    <td className="p-3 text-left">{item.email}</td>
                    <td className="p-3 text-left">{item.mobile}</td>
                    <td className="p-3 text-left">******</td>
                    <td className="p-3 text-left">{item.role}</td>

                    <td className="text-center">
                      <button
                        onClick={() => deleteSlider(item._id)}
                        className="p-2 bg-red-100 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={mycurrentPage === 1}
                onClick={() => setmyCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Prev
              </button>

              {[...Array(mytotalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setmyCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${mycurrentPage === i + 1
                    ? "bg-amber-400"
                    : "bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={mycurrentPage === mytotalPages}
                onClick={() => setmyCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}