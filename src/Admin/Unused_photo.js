import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function UnusedImagesManager() {
    const [unusedImages, setUnusedImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const token = localStorage.getItem("token");

    /* ================= AXIOS CONFIG ================= */
    const api = axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    /* ================= FETCH UNUSED ================= */
    const fetchUnused = async () => {
        try {
            if (!token) {
                toast.error("Please login first ❌");
                return;
            }

            const res = await api.post("/unused/list");

            setUnusedImages(res.data.unusedFiles || []);
        } catch (err) {
            console.error(err.response?.data || err.message);

            if (err.response?.status === 401) {
                toast.error("Session expired, login again ❌");
                localStorage.removeItem("token");
            } else if (err.response?.status === 403) {
                toast.error("Admin access required ❌");
            } else {
                toast.error("Failed to fetch unused files ❌");
            }
        }
    };

    useEffect(() => {
        fetchUnused();
    }, []);

    /* ================= SELECT ================= */
    const toggleSelect = (img) => {
        setSelectedImages((prev) =>
            prev.includes(img)
                ? prev.filter((i) => i !== img)
                : [...prev, img]
        );
    };

    /* ================= DELETE SELECTED ================= */
    const deleteSelected = () => {
        if (!selectedImages.length) {
            return toast.error("No files selected ❌");
        }

        toast((t) => (
            <div className="flex flex-col gap-3">
                <span>Delete selected files?</span>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await api.post("/unused/delete-selected", {
                                    files: selectedImages,
                                });

                                toast.success("Selected deleted 🗑️");
                                setSelectedImages([]);
                                fetchUnused();
                            } catch (err) {
                                console.error(err);
                                toast.error("Delete failed ❌");
                            }

                            toast.dismiss(t.id);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    /* ================= DELETE ALL ================= */
    const deleteAllUnused = () => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span>Delete ALL unused files?</span>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await api.post("/unused/delete-all");

                                toast.success("All deleted 🗑️");
                                fetchUnused();
                            } catch (err) {
                                console.error(err);
                                toast.error("Delete failed ❌");
                            }

                            toast.dismiss(t.id);
                        }}
                        className="px-3 py-1 bg-black text-white rounded"
                    >
                        Delete All
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        Unused Files Manager
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={deleteSelected}
                            className="bg-red-500 px-4 py-2 rounded"
                        >
                            Delete Selected
                        </button>

                        <button
                            onClick={deleteAllUnused}
                            className="bg-black px-4 py-2 rounded"
                        >
                            Delete All
                        </button>
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

                    {unusedImages.map((file, index) => (
                        <div
                            key={index}
                            onClick={() => toggleSelect(file)}
                            className={`relative cursor-pointer border-2 rounded overflow-hidden 
                            ${
                                selectedImages.includes(file)
                                    ? "border-red-500"
                                    : "border-transparent"
                            }`}
                        >
                            <img
                                src={`http://localhost:5000/uploads/${file}`}
                                className="h-40 w-full object-cover"
                                alt={file}
                            />

                            {selectedImages.includes(file) && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded">
                                    ✓
                                </div>
                            )}
                        </div>
                    ))}

                </div>

                {/* EMPTY STATE */}
                {unusedImages.length === 0 && (
                    <p className="text-center mt-10 text-gray-500">
                        No unused files 🎉
                    </p>
                )}
            </div>
        </div>
    );
}