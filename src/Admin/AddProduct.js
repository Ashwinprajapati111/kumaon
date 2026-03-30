import Admin_test from "./Admin_test";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaEye } from "react-icons/fa";
import "./Mycss.css";
import { useParams } from "react-router-dom";
import Data from "../Data.json";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const InputBox = ({ className = "", ...props }) => (
    <input
        {...props}
        className={classNames(
            "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition",
            "focus:border-amber-400 focus:ring-4 focus:ring-amber-100",
            className
        )}
    />
);

const TextAreaBox = ({ className = "", ...props }) => (
    <textarea
        {...props}
        className={classNames(
            "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition",
            "focus:border-amber-400 focus:ring-4 focus:ring-amber-100",
            className
        )}
    />
);

const SectionCard = ({ title, subtitle, children }) => (
    <div className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {children}
    </div>
);


export default function Example() {
    const formRef = useRef(null);
    const fileInputRef = useRef(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");
    const [Properties, setProperties] = useState("");
    const [Ingredients, setIngredients] = useState("");
    const [Single_Origin, setSingle_Origin] = useState("");
    const [Taste_Notes, setTaste_Notes] = useState("");
    const [Why_main_title, setWhy_main_title] = useState("");
    const [Why_main_desc, setWhy_main_desc] = useState("");
    const [Disclaimer, setDisclaimer] = useState("");

    const [productimage, setProductimage] = useState(null);
    const [productbgimage, setProductbgimage] = useState(null);
    const [productimages, setProductimages] = useState([]);

    const [imagepreview, setImagepreview] = useState(null);
    const [imagebgpreview, setImagebgpreview] = useState(null);
    const [imagespreview, setImagespreview] = useState([]);

    const [why, setWhy] = useState([{ why_question: "", why_answer: "" }]);
    const [faq, setFaq] = useState([{ faq_question: "", faq_answer: "" }]);

    const [tab, setTab] = useState(2);
    const [searchTerm, setSearchTerm] = useState("");
    const [galleryModal, setGalleryModal] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryTitle, setGalleryTitle] = useState("");
    const [activeImage, setActiveImage] = useState(0);

    const [filterYear, setFilterYear] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [mycurrentPage, setmyCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { id } = useParams();
    const photo = Data[0].products;
    const gallery = photo.find((item) => item.id === parseInt(id));

    const [SeData, setSeData] = useState([]);

    const [editProduct, setEditProduct] = useState({
        name: "",
        price: "",
        desc: "",
        Properties: "",
        Ingredients: "",
        Single_Origin: "",
        Taste_Notes: "",
        Why_main_title: "",
        Why_main_desc: "",
        Disclaimer: "",
        why: [],
        faq: [],
        productimage: null,
        productbgimage: null,
        productimages: [],
    });

    const [editModal, setEditModal] = useState(false);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [editBgPreview, setEditBgPreview] = useState(null);
    const [editMultiPreview, setEditMultiPreview] = useState([]);

    // WHY
    const handleWhyChange = (index, e) => {
        const newWhy = [...why];
        newWhy[index][e.target.name] = e.target.value;
        setWhy(newWhy);
    };

    const removeWhy = (index) => {
        const values = [...why];
        values.splice(index, 1);
        setWhy(values);
    };

    const addWhy = () => {
        setWhy([...why, { why_question: "", why_answer: "" }]);
    };

    // FAQ
    const handleFaqChange = (index, e) => {
        const newFaq = [...faq];
        newFaq[index][e.target.name] = e.target.value;
        setFaq(newFaq);
    };

    const addFaq = () => {
        setFaq([...faq, { faq_question: "", faq_answer: "" }]);
    };

    const removeFaq = (index) => {
        const newFaq = [...faq];
        newFaq.splice(index, 1);
        setFaq(newFaq);
    };

    // MAIN IMAGE
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProductimage(file);
        setImagepreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setProductimage(null);
        setImagepreview(null);
    };

    // BG IMAGE
    const handleBgImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProductbgimage(file);
        setImagebgpreview(URL.createObjectURL(file));
    };

    const removebgImage = () => {
        setProductbgimage(null);
        setImagebgpreview(null);
    };

    // MULTI IMAGE
    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        setProductimages((prev) => [...prev, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagespreview((prev) => [...prev, ...previews]);
    };

    const removeProductImages = (index) => {
        const newImages = [...productimages];
        const newPreview = [...imagespreview];
        newImages.splice(index, 1);
        newPreview.splice(index, 1);
        setProductimages(newImages);
        setImagespreview(newPreview);
    };

    const openGalleryModal = (images, title = "Preview", index = 0) => {
        setGalleryImages(images);
        setGalleryTitle(title);
        setActiveImage(index);
        setGalleryModal(true);
    };

    // ADD PRODUCT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("desc", desc);
            formData.append("Properties", Properties);
            formData.append("Disclaimer", Disclaimer);
            formData.append("Ingredients", Ingredients);
            formData.append("Single_Origin", Single_Origin);
            formData.append("Taste_Notes", Taste_Notes);
            formData.append("Why_main_title", Why_main_title);
            formData.append("Why_main_desc", Why_main_desc);
            formData.append("productimage", productimage);
            formData.append("productbgimage", productbgimage);
            productimages.forEach((img) => {
                formData.append("productimages", img);
            });
            formData.append("why", JSON.stringify(why));
            formData.append("faq", JSON.stringify(faq));

            await axios.post("http://localhost:5000/api/products/post", formData);

            alert("Product Added successfully ✅");

            setName("");
            setPrice("");
            setDesc("");
            setProperties("");
            setSingle_Origin("");
            setIngredients("");
            setTaste_Notes("");
            setWhy_main_title("");
            setWhy_main_desc("");
            setDisclaimer("");

            setProductimage(null);
            setProductbgimage(null);
            setImagepreview(null);
            setImagebgpreview(null);
            setImagespreview([]);
            setProductimages([]);

            setWhy([{ why_question: "", why_answer: "" }]);
            setFaq([{ faq_question: "", faq_answer: "" }]);

            if (formRef.current) {
                formRef.current.reset();
            }

            showdata();
            setTab(2);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelImage = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    // DELETE
    const deleteProduct = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-sm">
                    Delete this product?
                </p>

                <div className="flex justify-end gap-2">
                    {/* Cancel */}
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
                    >
                        Cancel
                    </button>

                    {/* Confirm Delete */}
                    <button
                        onClick={async () => {
                            try {
                                await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
                                toast.dismiss(t.id);
                                toast.success("Product deleted successfully 🗑️");
                                showdata();
                            } catch (error) {
                                console.error(error);
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

    // FETCH
    const showdata = async () => {
        const res = await axios.get("http://localhost:5000/api/products/getall");
        setSeData(res.data.reverse());
    };

    // EDIT
    const handleEdit = (product) => {
        setEditProduct({
            ...product,
            why: product.why || [],
            faq: product.faq || [],
            productimages: [],
        });

        setEditImagePreview(
            `http://localhost:5000/file/files/${product.productimage}`
        );

        setEditBgPreview(
            `http://localhost:5000/file/files/${product.productbgimage}`
        );

        setEditMultiPreview(
            product.productimages?.map(
                (img) => `http://localhost:5000/file/files/${img}`
            ) || []
        );

        setEditModal(true);

        // ✅ Toast Alert
        toast.success("Product loaded for editing ✏️");
    };

    const handleEditWhy = (index, e) => {
        const updatedWhy = [...editProduct.why];
        updatedWhy[index][e.target.name] = e.target.value;
        setEditProduct({
            ...editProduct,
            why: updatedWhy,
        });
    };

    const removeEditWhy = (index) => {
        const updatedWhy = [...editProduct.why];
        updatedWhy.splice(index, 1);
        setEditProduct({
            ...editProduct,
            why: updatedWhy,
        });
    };

    const addEditWhy = () => {
        setEditProduct({
            ...editProduct,
            why: [...editProduct.why, { why_question: "", why_answer: "" }],
        });
    };

    const handleEditFaq = (index, e) => {
        const updatedFaq = [...editProduct.faq];
        updatedFaq[index][e.target.name] = e.target.value;
        setEditProduct({
            ...editProduct,
            faq: updatedFaq,
        });
    };

    const addEditFaq = () => {
        setEditProduct({
            ...editProduct,
            faq: [...editProduct.faq, { faq_question: "", faq_answer: "" }],
        });
    };

    const removeEditFaq = (index) => {
        const updatedFaq = [...editProduct.faq];
        updatedFaq.splice(index, 1);
        setEditProduct({
            ...editProduct,
            faq: updatedFaq,
        });
    };

    const handleEditImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProduct({
                ...editProduct,
                productimage: file,
            });
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const removeEditImage = () => {
        setEditProduct({
            ...editProduct,
            productimage: null,
            removeProductImage: true,
        });
        setEditImagePreview(null);
    };

    const handleEditBgImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProduct({
                ...editProduct,
                productbgimage: file,
            });
            setEditBgPreview(URL.createObjectURL(file));
        }
    };

    const removeEditBgImage = () => {
        setEditProduct({
            ...editProduct,
            productbgimage: null,
            removeBgImage: true,
        });
        setEditBgPreview(null);
    };

    const handleEditMultiImages = (e) => {
        const files = Array.from(e.target.files);

        setEditProduct({
            ...editProduct,
            productimages: [...editProduct.productimages, ...files],
        });

        const previews = files.map((file) => URL.createObjectURL(file));
        setEditMultiPreview((prev) => [...prev, ...previews]);
    };

    const removeEditMultiImage = (index) => {
        const removedImage = editMultiPreview[index];
        const newPreview = [...editMultiPreview];
        newPreview.splice(index, 1);
        setEditMultiPreview(newPreview);

        setEditProduct({
            ...editProduct,
            removedImages: [...(editProduct.removedImages || []), removedImage],
        });
    };

    const handleUpdate = async () => {
        const loadingToast = toast.loading("Updating product...");

        try {
            const formData = new FormData();

            formData.append("name", editProduct.name);
            formData.append("price", editProduct.price);
            formData.append("desc", editProduct.desc);
            formData.append("Properties", editProduct.Properties);
            formData.append("Ingredients", editProduct.Ingredients);
            formData.append("Single_Origin", editProduct.Single_Origin);
            formData.append("Taste_Notes", editProduct.Taste_Notes);
            formData.append("Why_main_title", editProduct.Why_main_title);
            formData.append("Why_main_desc", editProduct.Why_main_desc);
            formData.append("Disclaimer", editProduct.Disclaimer);

            if (editProduct.productimage instanceof File) {
                formData.append("productimage", editProduct.productimage);
            }

            if (editProduct.productbgimage instanceof File) {
                formData.append("productbgimage", editProduct.productbgimage);
            }

            if (editProduct.productimages.length > 0) {
                editProduct.productimages.forEach((img) => {
                    if (img instanceof File) {
                        formData.append("productimages", img);
                    }
                });
            }

            formData.append(
                "removeProductImage",
                editProduct.removeProductImage || false
            );
            formData.append(
                "removeBgImage",
                editProduct.removeBgImage || false
            );
            formData.append(
                "removedImages",
                JSON.stringify(editProduct.removedImages || [])
            );

            formData.append("why", JSON.stringify(editProduct.why));
            formData.append("faq", JSON.stringify(editProduct.faq));

            await axios.put(
                `http://localhost:5000/api/products/update/${editProduct._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.dismiss(loadingToast);
            toast.success("Product updated successfully ✅");

            setEditModal(false);
            showdata();

        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            toast.error("Update failed ❌");
        }
    };
    // FILTERED PRODUCTS
    const myyears = [...new Set(SeData.map((g) => g.myyear).filter(Boolean))];

    const myfilteredData = useMemo(() => {
        let mydata = [...SeData];

        if (searchTerm.trim()) {
            mydata = mydata.filter(
                (item) =>
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.Properties?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.Ingredients?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterYear !== "All") {
            mydata = mydata.filter((g) => g.myyear === Number(filterYear));
        }

        mydata.sort((a, b) =>
            sortOrder === "latest"
                ? new Date(b.createdAt || b.mydata || 0) - new Date(a.createdAt || a.mydata || 0)
                : new Date(a.createdAt || a.mydata || 0) - new Date(b.createdAt || b.mydata || 0)
        );

        return mydata;
    }, [SeData, filterYear, sortOrder, searchTerm]);

    const mytotalPages = Math.ceil(myfilteredData.length / itemsPerPage);
    const mystartIndex = (mycurrentPage - 1) * itemsPerPage;
    const mypaginatedData = myfilteredData.slice(
        mystartIndex,
        mystartIndex + itemsPerPage
    );


    //   inputbox

    useEffect(() => {
        showdata();
    }, []);



    // ✅ MOVE OUTSIDE

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-white">

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Toaster position="top-right" />
                {/* Header */}
                <div className="mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-amber-200">
                                Admin Dashboard
                            </p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Product Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Add, view, search, edit and manage products with a clean modern dashboard.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs text-slate-300">Total Products</p>
                                <p className="mt-1 text-2xl font-bold">{SeData.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs text-slate-300">Showing</p>
                                <p className="mt-1 text-2xl font-bold">{mypaginatedData.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4 col-span-2 sm:col-span-1">
                                <p className="text-xs text-slate-300">Active Tab</p>
                                <p className="mt-1 text-base font-bold">
                                    {tab === 1 ? "Add Product" : "View Products"}
                                </p>
                            </div>
                        </div>
                    </div>
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
                            Add Products
                        </button>
                        <button
                            onClick={() => setTab(2)}
                            className={classNames(
                                "relative z-10 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:px-8",
                                tab === 2 ? "text-slate-900" : "text-slate-600"
                            )}
                        >
                            <FaEye />
                            View Products
                        </button>
                    </div>
                </div>

                {/* ADD PRODUCT TAB */}
                <section
                    className={classNames(
                        "transition-all duration-300",
                        tab === 1 ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-3"
                    )}
                >
                    {tab === 1 && (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            {/* BASIC DETAILS */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <InputBox
                                    type="text"
                                    value={name}
                                    name="name"
                                    placeholder="Product Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <InputBox
                                    type="number"
                                    value={price}
                                    name="price"
                                    placeholder="Price"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <TextAreaBox
                                    value={desc}
                                    name="desc"
                                    placeholder="Description"
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="md:col-span-2 min-h-[110px]"
                                />
                                <InputBox
                                    type="text"
                                    value={Properties}
                                    name="Properties"
                                    placeholder="Properties"
                                    onChange={(e) => setProperties(e.target.value)}
                                />
                                <InputBox
                                    type="text"
                                    value={Ingredients}
                                    name="Ingredients"
                                    placeholder="Ingredients"
                                    onChange={(e) => setIngredients(e.target.value)}
                                />
                                <InputBox
                                    type="text"
                                    value={Single_Origin}
                                    name="Single_Origin"
                                    placeholder="Single Origin"
                                    onChange={(e) => setSingle_Origin(e.target.value)}
                                />
                                <InputBox
                                    type="text"
                                    value={Taste_Notes}
                                    name="Taste_Notes"
                                    placeholder="Taste Notes"
                                    onChange={(e) => setTaste_Notes(e.target.value)}
                                />
                                <InputBox
                                    type="text"
                                    value={Why_main_title}
                                    name="Why_main_title"
                                    placeholder="Why Main Title"
                                    onChange={(e) => setWhy_main_title(e.target.value)}
                                />
                                <InputBox
                                    type="text"
                                    value={Why_main_desc}
                                    name="Why_main_desc"
                                    placeholder="Why Main Description"
                                    onChange={(e) => setWhy_main_desc(e.target.value)}
                                />
                                <TextAreaBox
                                    value={Disclaimer}
                                    name="Disclaimer"
                                    placeholder="Disclaimer"
                                    onChange={(e) => setDisclaimer(e.target.value)}
                                    className="md:col-span-2 min-h-[90px]"
                                />
                            </div>

                            {/* IMAGE UPLOADS */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Main Image */}
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <label className="mb-3 block text-sm font-bold text-slate-800">
                                        Upload Main Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                                    />
                                    {imagepreview && (
                                        <div className="mt-4 relative">
                                            <img
                                                src={imagepreview}
                                                alt="preview"
                                                className="h-44 w-full rounded-2xl object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="mt-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Background Image */}
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <label className="mb-3 block text-sm font-bold text-slate-800">
                                        Upload Background Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleBgImageChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                                    />
                                    {imagebgpreview && (
                                        <div className="mt-4 relative">
                                            <img
                                                src={imagebgpreview}
                                                alt="preview"
                                                className="h-44 w-full rounded-2xl object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removebgImage}
                                                className="mt-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Multiple Images */}
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <label className="mb-3 block text-sm font-bold text-slate-800">
                                        Upload Product Images
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleProductImageChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                                    />
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {imagespreview.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={img}
                                                    alt="preview"
                                                    className="h-28 w-full rounded-2xl object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeProductImages(index)}
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* WHY SECTION */}
                            <SectionCard title="Why Section" subtitle="Add multiple why question and answer blocks">
                                <div className="space-y-4">
                                    {why.map((item, index) => (
                                        <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <InputBox
                                                type="text"
                                                name="why_question"
                                                placeholder="Why Question"
                                                value={item.why_question}
                                                onChange={(e) => handleWhyChange(index, e)}
                                            />
                                            <TextAreaBox
                                                name="why_answer"
                                                placeholder="Why Answer"
                                                value={item.why_answer}
                                                onChange={(e) => handleWhyChange(index, e)}
                                                className="min-h-[110px]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeWhy(index)}
                                                className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white mt-2"
                                            >
                                                Remove Why
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addWhy}
                                        className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white"
                                    >
                                        Add More Why
                                    </button>
                                </div>
                            </SectionCard>

                            {/* FAQ SECTION */}
                            <SectionCard title="FAQ Section" subtitle="Add multiple FAQ question and answer blocks">
                                <div className="space-y-4">
                                    {faq.map((item, index) => (
                                        <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <InputBox
                                                type="text"
                                                name="faq_question"
                                                placeholder="FAQ Question"
                                                value={item.faq_question}
                                                onChange={(e) => handleFaqChange(index, e)}
                                            />
                                            <TextAreaBox
                                                name="faq_answer"
                                                placeholder="FAQ Answer"
                                                value={item.faq_answer}
                                                onChange={(e) => handleFaqChange(index, e)}
                                                className="min-h-[110px]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFaq(index)}
                                                className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white mt-2"
                                            >
                                                Remove FAQ
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addFaq}
                                        className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white"
                                    >
                                        Add More FAQ
                                    </button>
                                </div>
                            </SectionCard>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-amber-400 px-6 py-4 text-base font-bold text-slate-900 shadow-lg transition hover:scale-[1.01] hover:bg-amber-300"
                            >
                                Submit Product
                            </button>
                        </form>
                    )}
                </section>

                {/* VIEW PRODUCTS TAB */}
                <section
                    className={classNames(
                        "transition-all duration-300",
                        tab === 2 ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-3"
                    )}
                >
                    {tab === 2 && (
                        <div className="space-y-6">
                            {/* Search + Filters */}
                            <div className="rounded-[28px] bg-white p-5 shadow-lg ring-1 ring-slate-200">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">View Products</h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Search, filter and manage product cards
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
                                        <div className="relative min-w-[260px]">
                                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by name, desc, properties..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setmyCurrentPage(1);
                                                }}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                            />
                                        </div>

                                        <select
                                            value={filterYear}
                                            onChange={(e) => {
                                                setFilterYear(e.target.value);
                                                setmyCurrentPage(1);
                                            }}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-400"
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
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-400"
                                        >
                                            <option value="latest">Latest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Cards */}
                            {mypaginatedData.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {mypaginatedData.map((gallery) => (
                                        <div
                                            key={gallery._id}
                                            className="group overflow-hidden rounded-[28px] bg-white shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={`http://localhost:5000/file/files/${gallery.productimage}`}
                                                    alt={gallery.name}
                                                    className="h-60 w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800">
                                                    ₹{gallery.price}
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="line-clamp-1 text-xl font-bold text-white">
                                                        {gallery.name}
                                                    </h3>
                                                    <p className="mt-1 line-clamp-2 text-sm text-slate-200">
                                                        {gallery.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 p-5">
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs text-slate-500">Properties</p>
                                                        <p className="mt-1 line-clamp-2 font-medium text-slate-800">
                                                            {gallery.Properties}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs text-slate-500">Ingredients</p>
                                                        <p className="mt-1 line-clamp-2 font-medium text-slate-800">
                                                            {gallery.Ingredients}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs text-slate-500">Single Origin</p>
                                                        <p className="mt-1 line-clamp-2 font-medium text-slate-800">
                                                            {gallery.Single_Origin}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 p-3">
                                                        <p className="text-xs text-slate-500">Taste Notes</p>
                                                        <p className="mt-1 line-clamp-2 font-medium text-slate-800">
                                                            {gallery.Taste_Notes}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Gallery Images */}
                                                <div>
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <p className="text-sm font-bold text-slate-800">
                                                            Product Images
                                                        </p>
                                                        {gallery.productimages?.length > 0 && (
                                                            <button
                                                                onClick={() =>
                                                                    openGalleryModal(
                                                                        gallery.productimages.map(
                                                                            (img) =>
                                                                                `http://localhost:5000/file/files/${img}`
                                                                        ),
                                                                        `${gallery.name} Gallery`
                                                                    )
                                                                }
                                                                className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                                                            >
                                                                View All
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-2">
                                                        {gallery.productimages?.slice(0, 4).map((img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={`http://localhost:5000/file/files/${img}`}
                                                                alt={gallery.name}
                                                                onClick={() =>
                                                                    openGalleryModal(
                                                                        gallery.productimages.map(
                                                                            (m) =>
                                                                                `http://localhost:5000/file/files/${m}`
                                                                        ),
                                                                        `${gallery.name} Gallery`,
                                                                        idx
                                                                    )
                                                                }
                                                                className="h-16 w-full cursor-pointer rounded-xl object-cover"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Background Preview */}
                                                {gallery.productbgimage && (
                                                    <div>
                                                        <p className="mb-2 text-sm font-bold text-slate-800">
                                                            Background Image
                                                        </p>
                                                        <img
                                                            src={`http://localhost:5000/file/files/${gallery.productbgimage}`}
                                                            alt="bg"
                                                            onClick={() =>
                                                                openGalleryModal(
                                                                    [
                                                                        `http://localhost:5000/file/files/${gallery.productbgimage}`,
                                                                    ],
                                                                    `${gallery.name} Background`
                                                                )
                                                            }
                                                            className="h-28 w-full cursor-pointer rounded-2xl object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Why */}
                                                <div className="rounded-2xl bg-amber-50 p-4">
                                                    <h4 className="mb-2 text-sm font-bold text-slate-900">
                                                        Why Section
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {gallery.why?.length > 0 ? (
                                                            gallery.why.slice(0, 2).map((sss, idx) => (
                                                                <div key={idx} className="rounded-xl bg-white p-3">
                                                                    <p className="text-xs font-semibold text-slate-500">
                                                                        Question
                                                                    </p>
                                                                    <p className="text-sm font-medium text-slate-900">
                                                                        {sss.why_question}
                                                                    </p>
                                                                    <p className="mt-2 text-xs font-semibold text-slate-500">
                                                                        Answer
                                                                    </p>
                                                                    <p className="text-sm text-slate-700 line-clamp-2">
                                                                        {sss.why_answer}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-slate-500">No why data</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* FAQ */}
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <h4 className="mb-2 text-sm font-bold text-slate-900">
                                                        FAQ Section
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {gallery.faq?.length > 0 ? (
                                                            gallery.faq.slice(0, 2).map((sss, idx) => (
                                                                <div key={idx} className="rounded-xl bg-white p-3">
                                                                    <p className="text-xs font-semibold text-slate-500">
                                                                        Question
                                                                    </p>
                                                                    <p className="text-sm font-medium text-slate-900">
                                                                        {sss.faq_question}
                                                                    </p>
                                                                    <p className="mt-2 text-xs font-semibold text-slate-500">
                                                                        Answer
                                                                    </p>
                                                                    <p className="text-sm text-slate-700 line-clamp-2">
                                                                        {sss.faq_answer}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-slate-500">No faq data</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl bg-rose-50 p-4">
                                                    <p className="text-xs font-semibold text-slate-500">Disclaimer</p>
                                                    <p className="mt-1 text-sm text-slate-700 line-clamp-3">
                                                        {gallery.Disclaimer}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        onClick={() => handleEdit(gallery)}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                                                    >
                                                        <FaEdit />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(gallery._id)}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                                                    >
                                                        <FaTrash />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-[28px] bg-white p-10 text-center shadow-lg ring-1 ring-slate-200">
                                    <p className="text-lg font-semibold text-slate-700">No Product Found</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Try another search or filter.
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {mytotalPages > 0 && (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <button
                                        disabled={mycurrentPage === 1}
                                        onClick={() => setmyCurrentPage((prev) => prev - 1)}
                                        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 disabled:opacity-50"
                                    >
                                        Prev
                                    </button>

                                    {[...Array(mytotalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setmyCurrentPage(index + 1)}
                                            className={classNames(
                                                "rounded-2xl px-4 py-2 text-sm font-semibold shadow ring-1 ring-slate-200",
                                                mycurrentPage === index + 1
                                                    ? "bg-amber-400 text-slate-900"
                                                    : "bg-white text-slate-700"
                                            )}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        disabled={mycurrentPage === mytotalPages || mytotalPages === 0}
                                        onClick={() => setmyCurrentPage((prev) => prev + 1)}
                                        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* EDIT MODAL */}
                {editModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                        <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl sm:p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Edit Product</h2>
                                    <p className="text-sm text-slate-500">
                                        Update product details, images, why and faq sections
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditModal(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <SectionCard title="Basic Details">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InputBox
                                            placeholder="Name"
                                            value={editProduct.name}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, name: e.target.value })
                                            }
                                        />
                                        <InputBox
                                            placeholder="Price"
                                            value={editProduct.price}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, price: e.target.value })
                                            }
                                        />
                                        <TextAreaBox
                                            placeholder="Description"
                                            value={editProduct.desc}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, desc: e.target.value })
                                            }
                                            className="md:col-span-2 min-h-[110px]"
                                        />
                                        <InputBox
                                            placeholder="Properties"
                                            value={editProduct.Properties}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Properties: e.target.value,
                                                })
                                            }
                                        />
                                        <InputBox
                                            placeholder="Ingredients"
                                            value={editProduct.Ingredients}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Ingredients: e.target.value,
                                                })
                                            }
                                        />
                                        <InputBox
                                            placeholder="Single Origin"
                                            value={editProduct.Single_Origin}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Single_Origin: e.target.value,
                                                })
                                            }
                                        />
                                        <InputBox
                                            placeholder="Taste Notes"
                                            value={editProduct.Taste_Notes}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Taste_Notes: e.target.value,
                                                })
                                            }
                                        />
                                        <InputBox
                                            placeholder="Why Title"
                                            value={editProduct.Why_main_title}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Why_main_title: e.target.value,
                                                })
                                            }
                                        />
                                        <InputBox
                                            placeholder="Why Description"
                                            value={editProduct.Why_main_desc}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Why_main_desc: e.target.value,
                                                })
                                            }
                                        />
                                        <TextAreaBox
                                            placeholder="Disclaimer"
                                            value={editProduct.Disclaimer}
                                            onChange={(e) =>
                                                setEditProduct({
                                                    ...editProduct,
                                                    Disclaimer: e.target.value,
                                                })
                                            }
                                            className="md:col-span-2 min-h-[100px]"
                                        />
                                    </div>
                                </SectionCard>

                                <SectionCard title="Edit Images">
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                            <label className="mb-3 block font-bold">Main Image</label>
                                            <input type="file" onChange={handleEditImage} className="mb-3 w-full" />
                                            {editImagePreview && (
                                                <div className="space-y-3">
                                                    <img
                                                        src={editImagePreview}
                                                        alt="preview"
                                                        className="h-44 w-full rounded-2xl object-cover"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openGalleryModal([editImagePreview], "Main Image Preview")
                                                            }
                                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                                                        >
                                                            Preview
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={removeEditImage}
                                                            className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                            <label className="mb-3 block font-bold">Background Image</label>
                                            <input
                                                type="file"
                                                onChange={handleEditBgImage}
                                                className="mb-3 w-full"
                                            />
                                            {editBgPreview && (
                                                <div className="space-y-3">
                                                    <img
                                                        src={editBgPreview}
                                                        alt="preview"
                                                        className="h-44 w-full rounded-2xl object-cover"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openGalleryModal([editBgPreview], "Background Image Preview")
                                                            }
                                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                                                        >
                                                            Preview
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={removeEditBgImage}
                                                            className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                            <label className="mb-3 block font-bold">Product Images</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleEditMultiImages}
                                                className="mb-3 w-full"
                                            />

                                            <div className="grid grid-cols-2 gap-3">
                                                {editMultiPreview.map((img, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={img}
                                                            alt="preview"
                                                            className="h-28 w-full rounded-2xl object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEditMultiImage(index)}
                                                            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {editMultiPreview.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openGalleryModal(editMultiPreview, "Edit Product Images")
                                                    }
                                                    className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                                                >
                                                    Preview Gallery
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Why Section">
                                    <div className="space-y-4">
                                        {editProduct.why.map((item, index) => (
                                            <div
                                                key={index}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <InputBox
                                                    className="mb-3"
                                                    name="why_question"
                                                    placeholder="Question"
                                                    value={item.why_question}
                                                    onChange={(e) => handleEditWhy(index, e)}
                                                />
                                                <TextAreaBox
                                                    className="mb-3 min-h-[100px]"
                                                    name="why_answer"
                                                    placeholder="Answer"
                                                    value={item.why_answer}
                                                    onChange={(e) => handleEditWhy(index, e)}
                                                />
                                                <button
                                                    onClick={() => removeEditWhy(index)}
                                                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={addEditWhy}
                                            className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white"
                                        >
                                            Add Why
                                        </button>
                                    </div>
                                </SectionCard>

                                <SectionCard title="FAQ Section">
                                    <div className="space-y-4">
                                        {editProduct.faq.map((item, index) => (
                                            <div
                                                key={index}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <InputBox
                                                    className="mb-3"
                                                    name="faq_question"
                                                    placeholder="Question"
                                                    value={item.faq_question}
                                                    onChange={(e) => handleEditFaq(index, e)}
                                                />
                                                <TextAreaBox
                                                    className="mb-3 min-h-[100px]"
                                                    name="faq_answer"
                                                    placeholder="Answer"
                                                    value={item.faq_answer}
                                                    onChange={(e) => handleEditFaq(index, e)}
                                                />
                                                <button
                                                    onClick={() => removeEditFaq(index)}
                                                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={addEditFaq}
                                            className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white"
                                        >
                                            Add FAQ
                                        </button>
                                    </div>
                                </SectionCard>

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-800"
                                        onClick={() => setEditModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="rounded-2xl bg-amber-400 px-6 py-3 font-bold text-slate-900 shadow-lg"
                                        onClick={handleUpdate}
                                    >
                                        Update Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GALLERY MODAL */}
                {galleryModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-5xl rounded-[28px] bg-white p-4 shadow-2xl sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">{galleryTitle}</h3>
                                <button
                                    onClick={() => setGalleryModal(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
                                <div className="overflow-hidden rounded-3xl bg-slate-100">
                                    {galleryImages.length > 0 && (
                                        <img
                                            src={galleryImages[activeImage]}
                                            alt="gallery"
                                            className="h-[420px] w-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="grid max-h-[420px] grid-cols-3 gap-3 overflow-y-auto lg:grid-cols-1">
                                    {galleryImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={classNames(
                                                "overflow-hidden rounded-2xl border-2 transition",
                                                activeImage === index
                                                    ? "border-amber-400"
                                                    : "border-transparent"
                                            )}
                                        >
                                            <img
                                                src={img}
                                                alt={`thumb-${index}`}
                                                className="h-24 w-full object-cover lg:h-20"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}