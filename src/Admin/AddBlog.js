import React, { useState, useRef, useMemo, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaEye } from "react-icons/fa";
import "./Mycss.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Example() {
    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [blogimage, setBlogimage] = useState(null);
    const [title, setTitle] = useState("");
    const [blogpreview, setBlogpreview] = useState(null);
    const [subtitle, setSubtitle] = useState([{ subtitlein: "", subtitlematter: "" }]);

    const [filterYear, setFilterYear] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [mycurrentPage, setmyCurrentPage] = useState(1);
    const [tab, setTab] = useState(2);

    const [SeData, setSeData] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const [editData, setEditData] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editSubtitle, setEditSubtitle] = useState([]);
    const [editImage, setEditImage] = useState(null);
    const [editPreview, setEditPreview] = useState(null);

    const itemsPerPage = 5;

    // Image handlers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setBlogimage(file);
        setBlogpreview(URL.createObjectURL(file));
    };
    const removeImage = () => { setBlogimage(null); setBlogpreview(null); };

    // Subtitle handlers
    const handleblogChange = (index, e) => {
        const newSubtitle = [...subtitle];
        newSubtitle[index][e.target.name] = e.target.value;
        setSubtitle(newSubtitle);
    };
    const removeblog = (index) => {
        const values = [...subtitle];
        values.splice(index, 1);
        setSubtitle(values);
    };
    const addblog = () => setSubtitle([...subtitle, { subtitlein: "", subtitlematter: "" }]);

    // Add blog
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("subtitle", JSON.stringify(subtitle));
            if (blogimage) formData.append("blogimage", blogimage);
            await axios.post("http://localhost:5000/blog/post", formData);
            toast.success("Blog added successfully ✅");
            setTitle(""); setBlogimage(null); setBlogpreview(null);
            setSubtitle([{ subtitlein: "", subtitlematter: "" }]);
            showdata();
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            toast.error("Error adding blog ❌");
        }
    };

    // Delete blog
    const deleteBlog = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-semibold">Are you sure you want to delete this blog?</span>
                <div className="flex gap-2 justify-end">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={async () => {
                        toast.dismiss(t.id);
                        try { await axios.delete(`http://localhost:5000/blog/delete/${id}`); toast.success("Blog deleted successfully 🗑️"); showdata(); }
                        catch (err) { console.log(err); toast.error("Delete failed ❌"); }
                    }} className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500">Delete</button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    // Fetch data
    const showdata = async () => {
        const res = await axios.get("http://localhost:5000/blog/getall");
        setSeData(res.data.reverse());
    };
    useEffect(() => { showdata(); }, []);

    // Filtered + searched + sorted data
    const filteredData = useMemo(() => {
        let data = [...SeData];
        if (filterYear !== "All") data = data.filter(item => new Date(item.createdAt).getFullYear() === Number(filterYear));
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                (typeof item.subtitle === "string"
                    ? item.subtitle.toLowerCase().includes(query)
                    : (item.subtitle || []).map(sub => sub.subtitlein + " " + sub.subtitlematter).join(" ").toLowerCase().includes(query))
            );
        }
        data.sort((a, b) => sortOrder === "latest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));
        return data;
    }, [SeData, filterYear, sortOrder, searchQuery]);

    // Pagination
    const mytotalPages = Math.ceil(filteredData.length / itemsPerPage);
    const mypaginatedData = filteredData.slice((mycurrentPage - 1) * itemsPerPage, mycurrentPage * itemsPerPage);

    // Extract years
    const myyears = [...new Set(SeData.map(item => new Date(item.createdAt).getFullYear()))];

    // EDIT HANDLERS
    const addEditSubtitle = () => setEditSubtitle([...editSubtitle, { subtitlein: "", subtitlematter: "" }]);
    const removeEditSubtitle = (index) => { const values = [...editSubtitle]; values.splice(index, 1); setEditSubtitle(values); };
    const handleEditImageChange = (e) => { const file = e.target.files[0]; setEditImage(file); setEditPreview(URL.createObjectURL(file)); };
    const removeEditImage = () => { setEditImage("remove"); setEditPreview(null); };
    const handleEditSubtitleChange = (index, e) => { const values = [...editSubtitle]; values[index][e.target.name] = e.target.value; setEditSubtitle(values); };
    const handleEdit = (blog) => {
        setEditData(blog); setEditTitle(blog.title);
        setEditSubtitle(typeof blog.subtitle === "string" ? JSON.parse(blog.subtitle) : blog.subtitle || []);
        setEditPreview(blog.blogimage ? `http://localhost:5000/file/files/${blog.blogimage}` : null);
        setEditImage(null); setIsOpen(true);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", editTitle);
            formData.append("subtitle", JSON.stringify(editSubtitle));
            if (editImage && editImage !== "remove") formData.append("blogimage", editImage);
            if (editImage === "remove") formData.append("removeImage", "true");
            await axios.put(`http://localhost:5000/blog/update/${editData._id}`, formData);
            toast.success("Blog updated successfully ✏️");
            setIsOpen(false); showdata();
        } catch (err) { console.log(err); toast.error("Update failed ❌"); }
    };


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
                                Blog Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Add, view, search, edit and manage Blog
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
                                    Add Blog
                                </button>
                                <button
                                    onClick={() => setTab(2)}
                                    className={classNames(
                                        "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                                        tab === 2 ? "text-slate-900" : "text-slate-600"
                                    )}
                                >
                                    <FaEye />
                                    View Blog
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <section aria-labelledby="products-heading" className="pb-24">
                    {tab === 1 && (
                        <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#d1a345] to-yellow-500 px-6 py-5">
                                <h2 className="text-2xl font-bold text-black">Add Blog</h2>
                                <p className="text-black/70 text-sm mt-1">
                                    Fill the details below to publish a new blog.
                                </p>
                            </div>

                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 gap-6 p-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Blog Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        name="title"
                                        placeholder="Enter blog title"
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload Blog Image
                                    </label>
                                    <div className="rounded-2xl border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="w-full"
                                        />

                                        {blogpreview && (
                                            <div className="relative w-44 mt-4">
                                                <img
                                                    src={blogpreview}
                                                    alt="preview"
                                                    className="w-44 h-44 object-cover rounded-2xl shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-800">
                                            Blog Matter Section
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={addblog}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                                        >
                                            <FaPlus size={12} />
                                            Add Section
                                        </button>
                                    </div>

                                    <div className="space-y-5">
                                        {subtitle.map((item, index) => (
                                            <div
                                                key={index}
                                                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
                                            >
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Subtitle
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="subtitlein"
                                                        placeholder="Add Blog Subtitle"
                                                        value={item.subtitlein}
                                                        onChange={(e) => handleblogChange(index, e)}
                                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Content
                                                    </label>
                                                    <textarea
                                                        name="subtitlematter"
                                                        placeholder="Add Blog subtitle Content"
                                                        value={item.subtitlematter}
                                                        onChange={(e) => handleblogChange(index, e)}
                                                        rows={5}
                                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeblog(index)}
                                                    className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500 transition"
                                                >
                                                    Remove Section
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-2xl bg-[#d1a345] text-black font-bold py-3 shadow-md hover:shadow-xl hover:scale-[1.01] transition"
                                >
                                    Submit Blog
                                </button>
                            </form>
                        </div>
                    )}

                    {tab === 2 && (
                       <div className="rounded-3xl bg-white shadow-2xl border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">View Blogs</h2>
                                <p className="text-gray-500 text-sm mt-1">Browse and manage all blog entries.</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setmyCurrentPage(1); }}
                                    className="rounded-xl border border-gray-300 px-4 py-2 bg-white shadow-sm w-full md:w-64"
                                />
                                <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setmyCurrentPage(1); }} className="rounded-xl border border-gray-300 px-4 py-2 bg-white shadow-sm">
                                    <option value="All">All Years</option>
                                    {myyears.map((year) => (<option key={year} value={year}>{year}</option>))}
                                </select>
                                <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setmyCurrentPage(1); }} className="rounded-xl border border-gray-300 px-4 py-2 bg-white shadow-sm">
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-gray-200">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="p-4 text-sm font-semibold text-center">Index</th>
                                        <th className="p-4 text-sm font-semibold text-left">Blog Title</th>
                                        <th className="p-4 text-sm font-semibold text-center">Blog Image</th>
                                        <th className="p-4 text-sm font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mypaginatedData.map((blog, index) => (
                                        <tr key={blog._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="p-4 text-center">{(mycurrentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-4">{blog.title}</td>
                                            <td className="p-4 text-center">
                                                {blog.blogimage && <img src={`http://localhost:5000/file/files/${blog.blogimage}`} alt="thumbnail" className="h-16 w-16 object-cover rounded-xl mx-auto shadow-sm border" />}
                                            </td>
                                            <td className="p-4 text-center flex justify-center gap-3">
                                                <button onClick={() => handleEdit(blog)} className="bg-blue-100 text-blue-700 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition"><FaEdit /></button>
                                                <button onClick={() => deleteBlog(blog._id)} className="bg-red-100 text-red-700 p-3 rounded-xl hover:bg-red-600 hover:text-white transition"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {mypaginatedData.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-gray-500">No Blog Found</td></tr>}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            <button disabled={mycurrentPage === 1} onClick={() => setmyCurrentPage(prev => prev - 1)} className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300">Prev</button>
                            {[...Array(mytotalPages)].map((_, i) => (
                                <button key={i} onClick={() => setmyCurrentPage(i + 1)} className={classNames("px-4 py-2 rounded-xl transition", mycurrentPage === i + 1 ? "bg-[#d1a345] text-black font-semibold shadow" : "bg-gray-200 hover:bg-gray-300")}>{i + 1}</button>
                            ))}
                            <button disabled={mycurrentPage === mytotalPages || mytotalPages === 0} onClick={() => setmyCurrentPage(prev => prev + 1)} className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300">Next</button>
                        </div>
                    </div>
                    )}
                </section>

                {/* MODAL */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Edit Blog</h2>
                                    <p className="text-gray-200 text-sm">
                                        Update title, image, and content blocks.
                                    </p>
                                </div>

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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Blog Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Blog Title"
                                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Blog Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleEditImageChange}
                                        className="w-full rounded-2xl border border-gray-300 p-3"
                                    />

                                    {editPreview && (
                                        <div className="relative w-36 mt-4">
                                            <img
                                                src={editPreview}
                                                alt="preview"
                                                className="w-36 h-36 object-cover rounded-2xl shadow-md border"
                                            />

                                            <button
                                                type="button"
                                                onClick={removeEditImage}
                                                className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Blog Content
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addEditSubtitle}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                                        >
                                            <FaPlus size={12} />
                                            Add Section
                                        </button>
                                    </div>

                                    <div className="space-y-5">
                                        {editSubtitle.map((item, index) => (
                                            <div
                                                key={index}
                                                className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                                            >
                                                <input
                                                    type="text"
                                                    name="subtitlein"
                                                    value={item.subtitlein}
                                                    onChange={(e) => handleEditSubtitleChange(index, e)}
                                                    placeholder="Subtitle"
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                />

                                                <textarea
                                                    name="subtitlematter"
                                                    value={item.subtitlematter}
                                                    onChange={(e) => handleEditSubtitleChange(index, e)}
                                                    placeholder="Content"
                                                    rows={5}
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => removeEditSubtitle(index)}
                                                    className="mt-3 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500 transition"
                                                >
                                                    Remove Section
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
                                        Update Blog
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