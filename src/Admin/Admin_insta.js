import React, { useState, useRef, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from "react-icons/fa";
import "./Mycss.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function InstaVideoManager() {
    const formRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [title, setTitle] = useState("");
    const [tab, setTab] = useState(2);
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);

    // Edit states
    const [editData, setEditData] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const itemsPerPage = 5;

    // ---------------- Fetch Data ----------------
    const fetchVideos = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/insta/all");
            // grab the array from res.data.data
            setVideos(res.data.data.reverse());
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to fetch videos ❌");
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);
    console.log(videos)

    // ---------------- Add Video ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast.error("Video URL cannot be empty ❌");

        try {
            await axios.post(
                "http://localhost:5000/api/insta/create",
                { videoUrl: title }, // ✅ send the correct field name
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ pass admin JWT
                    },
                }
            );
            toast.success("Video added successfully ✅");
            setTitle("");
            fetchVideos();
            formRef.current?.reset();
        } catch (err) {
            console.error("Create error:", err.response || err);
            toast.error("Error adding video ❌");
        }
    };

    // ---------------- Delete Video ----------------
    const deleteVideo = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-semibold">Are you sure you want to delete this video?</span>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await axios.delete(`http://localhost:5000/api/insta/delete/${id}`, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
                                    },
                                });
                                toast.success("Video deleted successfully 🗑️");
                                fetchVideos();
                            } catch (err) {
                                console.error("Delete error:", err.response || err);
                                toast.error("Delete failed ❌");
                            }
                        }}
                        className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    // ---------------- Edit Video ----------------
    const handleEdit = (video) => {
        setEditData(video);
        setEditTitle(video.videoUrl); // use correct property from backend
        setIsOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editTitle.trim()) return toast.error("Video URL cannot be empty ❌");
        try {
            await axios.put(
                `http://localhost:5000/api/insta/update/${editData._id}`,
                { videoUrl: editTitle },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // or wherever you store it
                    },
                }
            );
            toast.success("Video updated successfully ✏️");
            setIsOpen(false);
            fetchVideos();
        } catch (err) {
            console.error(err);
            toast.error("Update failed ❌");
        }
    };

    // ---------------- Filter/Search ----------------
    const filteredVideos = useMemo(() => {
        if (!searchQuery.trim()) return videos;
        const query = searchQuery.toLowerCase();
        return videos.filter((video) => video.videoUrl.toLowerCase().includes(query));
    }, [videos, searchQuery]);

    // ---------------- Pagination ----------------
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const paginatedVideos = filteredVideos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
            <Toaster position="top-right" reverseOrder={false} />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-amber-200">
                                Admin Dashboard
                            </p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Insta Video Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Add, view, edit, and manage Insta Videos
                            </p>
                        </div>

                        {/* Tabs */}
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
                                    <FaPlus /> Add Video
                                </button>
                                <button
                                    onClick={() => setTab(2)}
                                    className={classNames(
                                        "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                                        tab === 2 ? "text-slate-900" : "text-slate-600"
                                    )}
                                >
                                    <FaEye /> View Videos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Video */}
                {tab === 1 && (
                    <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#d1a345] to-yellow-500 px-6 py-5">
                            <h2 className="text-2xl font-bold text-black">Add Insta Video</h2>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 p-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram Video URL</label>
                                <input
                                    type="text"
                                    value={title}
                                    placeholder="Paste video URL"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-2xl bg-[#d1a345] text-black font-bold py-3 shadow-md hover:shadow-xl hover:scale-[1.01] transition"
                            >
                                Submit Video
                            </button>
                        </form>
                    </div>
                )}

                {/* View Videos */}
                {tab === 2 && (
                    <div className="rounded-3xl bg-white shadow-2xl border border-gray-200 p-6">
                        <div className="overflow-x-auto rounded-2xl border border-gray-200">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="p-4 text-sm font-semibold text-center">#</th>
                                        <th className="p-4 text-sm font-semibold text-center">Video URL</th>
                                        <th className="p-4 text-sm font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedVideos.map((video, index) => (
                                        <tr key={video._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="p-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-4">{video.videoUrl}</td>
                                            <td className="p-4 text-center flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(video)}
                                                    className="bg-blue-100 text-blue-700 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => deleteVideo(video._id)}
                                                    className="bg-red-100 text-red-700 p-3 rounded-xl hover:bg-red-600 hover:text-white transition"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedVideos.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center p-8 text-gray-500">No videos found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={classNames(
                                        "px-4 py-2 rounded-xl transition",
                                        currentPage === i + 1 ? "bg-[#d1a345] text-black font-semibold shadow" : "bg-gray-200 hover:bg-gray-300"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700">
                                <h2 className="text-2xl font-bold text-white">Edit Video</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-2xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-2xl bg-[#d1a345] px-5 py-3 font-bold text-black hover:shadow-lg transition"
                                    >
                                        Update Video
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}