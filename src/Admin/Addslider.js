import React, { useState, useRef, useMemo, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Example() {
    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    const [sliderimage, setSliderimage] = useState(null);
    const [sliderpreview, setSliderpreview] = useState(null);

    const [tab, setTab] = useState(2);


    const [SeData, setSeData] = useState([]);
  

    const [previewModal, setPreviewModal] = useState(null);
    const [editId, setEditId] = useState(null);

    // ================= IMAGE =================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSliderimage(file);
        setSliderpreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setSliderimage(null);
        setSliderpreview(null);
    };

    // ================= SUBMIT / UPDATE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!sliderimage) {
            toast.error("Please select an image ❌");
            return;
        }

        const formData = new FormData();
        formData.append("sliderimage", sliderimage);

        try {
            if (editId) {
                await axios.put(
                    `http://localhost:5000/slider/update/${editId}`,
                    formData
                );

                toast.success("Slider updated successfully ✏️");
                setEditId(null);
            } else {
                await axios.post("http://localhost:5000/slider/post", formData);
                toast.success("Slider added successfully 🎉");
            }

            setSliderimage(null);
            setSliderpreview(null);

            if (formRef.current) formRef.current.reset();

            showdata();
            setTab(2);
        } catch (err) {
            toast.error("Something went wrong ❌");
            console.log(err);
        }
    };

    // ================= FETCH =================
    const showdata = async () => {
        try {
            const res = await axios.get("http://localhost:5000/slider/getall");
            setSeData(res.data.reverse());
        } catch (err) {
            toast.error("Failed to fetch sliders ❌");
        }
    };

    useEffect(() => {
        showdata();
    }, []);

    // ================= DELETE =================
    const deleteSlider = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-medium">Delete this slider?</span>

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 rounded-lg bg-gray-200 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await axios.delete(
                                    `http://localhost:5000/slider/delete/${id}`
                                );

                                toast.success("Deleted successfully 🗑️");
                                showdata();
                            } catch (err) {
                                toast.error("Delete failed ❌");
                            }

                            toast.dismiss(t.id);
                        }}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        ));
    };

    // ================= EDIT =================
    const handleEdit = (item) => {
        setEditId(item._id);
        setSliderpreview(
            `http://localhost:5000/file/files/${item.sliderimage}`
        );
        setTab(1);
        toast("Editing slider ✏️");
    };

    // ================= FILTER =================
    const filteredData = SeData;


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">

            {/* ✅ TOASTER */}
            <Toaster position="top-right" reverseOrder={false} />

            <div className="max-w-7xl mx-auto">

              
                {/* Header */}
                <div className="mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-amber-200">
                                Admin Dashboard
                            </p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Slider Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Add, view, search, edit and manage Slider
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
                                    Add Slider
                                </button>
                                <button
                                    onClick={() => setTab(2)}
                                    className={classNames(
                                        "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                                        tab === 2 ? "text-slate-900" : "text-slate-600"
                                    )}
                                >
                                    <FaEye />
                                    View Slider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= ADD TAB ================= */}
                {tab === 1 && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Slider" : "Upload Slider"}
                        </h2>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            {sliderpreview && (
                                <div className="relative">
                                    <img
                                        src={sliderpreview}
                                        className="h-40 w-full object-cover rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-black text-white px-2 rounded-full"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            <button className="w-full bg-amber-400 py-3 rounded-xl font-bold hover:bg-amber-500">
                                {editId ? "Update Slider" : "Submit Slider"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ================= VIEW TAB ================= */}
                {tab === 2 && (
                    <>
                        {/* SEARCH */}
                    

                        {/* CARDS */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredData.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl shadow hover:shadow-xl transition p-3"
                                >
                                    <img
                                        src={`http://localhost:5000/file/files/${item.sliderimage}`}
                                        className="h-40 w-full object-cover rounded-xl cursor-pointer"
                                        onClick={() =>
                                            setPreviewModal(
                                                `http://localhost:5000/file/files/${item.sliderimage}`
                                            )
                                        }
                                    />

                                    <div className="flex justify-between mt-3">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-500 hover:scale-110"
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            onClick={() => deleteSlider(item._id)}
                                            className="text-red-500 hover:scale-110"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredData.length === 0 && (
                            <p className="text-center mt-10 text-gray-500">
                                No sliders found
                            </p>
                        )}
                    </>
                )}

                {/* IMAGE MODAL */}
                {previewModal && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center"
                        onClick={() => setPreviewModal(null)}
                    >
                        <img
                            src={previewModal}
                            className="max-h-[80%] rounded-xl shadow-2xl"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}