import React, { useState, useRef, useMemo, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from "react-icons/fa";
import "./Mycss.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Example() {

    const formRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterYear, setFilterYear] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [mycurrentPage, setmyCurrentPage] = useState(1);
    const [tab, setTab] = useState(2);

    const [SeData, setSeData] = useState([]);

    const [editIndex, setEditIndex] = useState(null);
    const [editPriceId, setEditPriceId] = useState(null);

    const [editStateData, setEditStateData] = useState({
        state: "",
        charge: ""
    });

    const [editGstId, setEditGstId] = useState(null);
    const [editGstValue, setEditGstValue] = useState("");

    const itemsPerPage = 5;

    // ---------------- FETCH ----------------
    const fetchPrices = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/price`);
            setSeData(res.data.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    // ---------------- UPDATE GST (FIXED) ----------------
    const updateGst = async (id) => {
        try {
            if (editGstValue === "") return toast.error("Enter GST");

            await axios.put(`${process.env.REACT_APP_API_URL}/api/price/${id}/gst`, {
  gst: Number(editGstValue),
});

            toast.success("GST updated successfully");

            setEditGstId(null);
            setEditGstValue("");

            fetchPrices();
        } catch (err) {
            console.log(err);
            toast.error("GST update failed");
        }
    };

    // ---------------- UPDATE STATE CHARGE ----------------
    const updateStateCharge = async (priceId, index) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/price/${priceId}/state`,
                {
                    index, // IMPORTANT FIX
                    state: editStateData.state,
                    charge: Number(editStateData.charge),
                }
            );

            toast.success("State updated successfully");

            setEditIndex(null);
            setEditPriceId(null);
            setEditStateData({ state: "", charge: "" });

            fetchPrices();
        } catch (err) {
            console.log(err.response?.data || err.message);
            toast.error("State update failed");
        }
    };

    // ---------------- RENDER ----------------
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (SeData.length >= 0) setLoading(false);
    }, [SeData]);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster />

            <main className="max-w-7xl mx-auto p-6">

                {/* HEADER */}
                <div className="mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h1 className="text-3xl font-black">Price Management</h1>
                            <p className="text-slate-300 text-sm mt-2">
                                Add, view, search, edit Prices
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setTab(2)}>
                                <FaEye /> View
                            </button>
                        </div>

                    </div>
                </div>

                {/* VIEW */}
                {tab === 2 && (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Price List</h2>

                        <table className="w-full border shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 border">GST (%)</th>
                                    <th className="p-3 border">State Charges</th>
                                </tr>
                            </thead>

                            <tbody>
                                {SeData.map((item) => (
                                    <tr key={item._id} className="text-center border-t">

                                        {/* GST FIXED */}
                                        <td className="p-3 border flex items-center gap-2">

                                            {editGstId === item._id ? (
                                                <>
                                                    <input
                                                        type="number"
                                                        value={editGstValue}
                                                        onChange={(e) => setEditGstValue(e.target.value)}
                                                        className="border px-2 w-20"
                                                    />

                                                    <button
                                                        onClick={() => updateGst(item._id)}
                                                        className="bg-green-500 text-white px-2 text-xs"
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{item.gst}%</span>

                                                    <button
                                                        onClick={() => {
                                                            setEditGstId(item._id);
                                                            setEditGstValue(item.gst);
                                                        }}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                </>
                                            )}
                                        </td>

                                        {/* STATE CHARGES */}
                                        <td className="p-3 border text-left">
                                            <ul className="space-y-1">
                                                {item.stateCharges?.map((sc, index) => (
                                                    <li key={index} className="flex gap-2 border-b py-2">

                                                        {editIndex === index && editPriceId === item._id ? (
                                                            <>
                                                                <input
                                                                    value={editStateData.state}
                                                                    onChange={(e) =>
                                                                        setEditStateData({
                                                                            ...editStateData,
                                                                            state: e.target.value,
                                                                        })
                                                                    }
                                                                    className="border px-1"
                                                                />

                                                                <input
                                                                    type="number"
                                                                    value={editStateData.charge}
                                                                    onChange={(e) =>
                                                                        setEditStateData({
                                                                            ...editStateData,
                                                                            charge: e.target.value,
                                                                        })
                                                                    }
                                                                    className="border px-1 w-20"
                                                                />

                                                                <button
                                                                    onClick={() => updateStateCharge(item._id, index)}
                                                                    className="bg-green-500 text-white px-2 text-xs"
                                                                >
                                                                    Save
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>{sc.state}</span>
                                                                <span>- ₹{sc.charge}</span>

                                                                <button
                                                                    onClick={() => {
                                                                        setEditIndex(index);
                                                                        setEditPriceId(item._id);
                                                                        setEditStateData(sc);
                                                                    }}
                                                                    className="bg-blue-500 text-white px-2 text-xs"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </>
                                                        )}

                                                    </li>
                                                ))}
                                            </ul>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </main>
        </div>
    );
}