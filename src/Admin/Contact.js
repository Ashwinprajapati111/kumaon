import React, { useState, useRef, useMemo, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "./Mycss.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Example() {
    const formRef = useRef(null);

    // 🔹 MAIN DATA
    const [SeData, setSeData] = useState([]);

    // 🔹 FORM STATES (kept as you had)
    const [blogimage, setBlogimage] = useState(null);
    const [title, setTitle] = useState("");
    const [blogpreview, setBlogpreview] = useState(null);
    const [subtitle, setSubtitle] = useState([
        { subtitlein: "", subtitlematter: "" },
    ]);

    // 🔹 UI STATES
    const [search, setSearch] = useState("");
    const [filterYear, setFilterYear] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [mycurrentPage, setmyCurrentPage] = useState(1);

    const itemsPerPage = 25;

    // 🔹 FETCH DATA
    const showdata = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5000/contact/getall", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSeData(res.data.reverse());

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
        }
    };

    // 🔹 YEARS (AUTO FROM createdAt)
    const myyears = [
        ...new Set(
            SeData.map((g) => new Date(g.createdAt).getFullYear())
        ),
    ];

    // 🔹 FILTER + SEARCH + SORT
    const myfilteredData = useMemo(() => {
        let mydata = [...SeData];

        // Year filter
        if (filterYear !== "All") {
            mydata = mydata.filter(
                (g) =>
                    new Date(g.createdAt).getFullYear() === Number(filterYear)
            );
        }

        // Search
        if (search.trim() !== "") {
            mydata = mydata.filter((item) =>
                `${item.firstname} ${item.lastname} ${item.email} ${item.phone}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Sort
        mydata.sort((a, b) =>
            sortOrder === "latest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
        );

        return mydata;
    }, [SeData, filterYear, sortOrder, search]);

    // 🔹 PAGINATION (FIXED)
    const indexOfLastItem = mycurrentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const mytotalPages = Math.ceil(myfilteredData.length / itemsPerPage);

    const mypaginatedData = myfilteredData.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // 🔹 DELETE
    const deleteSlider = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">
                    Are you sure you want to delete?
                </p>

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem("token");

                                await axios.delete(`http://localhost:5000/contact/delete/${id}`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                });
                                toast.dismiss(t.id);
                                toast.success("Deleted successfully 🗑️");
                                showdata();
                            } catch (err) {
                                console.log(err);
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
        ), {
            duration: 5000,
        });
    };

    // 🔹 EDIT (kept same)
    const handleEdit = (id) => {
        alert("Edit ID: " + id);
    };
    useEffect(() => {
        showdata();
    }, []);

    return (
        <div className="bg-gray-100">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Toaster position="top-right" />
                {/* Header */}
                <div className="mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-amber-200">
                                Admin Dashboard
                            </p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Customers messages Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Add, view, search, edit and manage Customers messages
                            </p>
                        </div>

                        {/* Animated Tabs */}
                        <div className="mb-8 flex justify-center">
                            <div className="relative inline-flex rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200">


                                <button

                                    className={classNames(
                                        "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                                        "text-slate-900"
                                    )}
                                >
                                    <FaEye />
                                    View Contact
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION */}
                <section className="pt-6 pb-24">
                    <div className="bg-white shadow-2xl rounded-3xl p-6">

                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Contact Manager
                            </h2>

                            {/* SEARCH */}
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setmyCurrentPage(1);
                                }}
                                className="px-4 py-2 rounded-xl border w-full md:w-80"
                            />
                        </div>

                        {/* FILTERS */}
                        <div className="flex gap-3 mb-6">
                            <select
                                value={filterYear}
                                onChange={(e) => {
                                    setFilterYear(e.target.value);
                                    setmyCurrentPage(1);
                                }}
                                className="border px-4 py-2 rounded-xl"
                            >
                                <option value="All">All Years</option>
                                {myyears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortOrder}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    setmyCurrentPage(1);
                                }}
                                className="border px-4 py-2 rounded-xl"
                            >
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto rounded-2xl border">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="p-3">#</th>
                                        <th className="p-3 text-left">First Name</th>
                                        <th className="p-3 text-left">Last Name</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Phone</th>
                                        <th className="p-3 text-left">Message</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {mypaginatedData.map((item, index) => (
                                        <tr key={item._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-center">
                                                {indexOfFirstItem + index + 1}
                                            </td>
                                            <td className="p-3">{item.firstname}</td>
                                            <td className="p-3">{item.lastname}</td>
                                            <td className="p-3">{item.email}</td>
                                            <td className="p-3">{item.phone}</td>
                                            <td className="p-3 truncate max-w-xs">
                                                {item.message}
                                            </td>

                                            <td className="p-3 text-center">
                                                <div className="flex justify-center gap-3">


                                                    <button
                                                        onClick={() => deleteSlider(item._id)}
                                                        className="p-2 bg-red-100 rounded-lg"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {mypaginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center p-6">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

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
                                        ? "bg-[#d1a345]"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={mycurrentPage === mytotalPages || mytotalPages === 0}
                                onClick={() => setmyCurrentPage((p) => p + 1)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}