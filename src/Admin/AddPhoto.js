import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EventGallery() {
  const formRef = useRef(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // ✅ EXISTING IMAGES (IMPORTANT)
  const [existingImages, setExistingImages] = useState([]);

  const [tab, setTab] = useState(2);
  const [galleryData, setGalleryData] = useState([]);
  const [editId, setEditId] = useState(null);

  // ================= COVER =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // ================= MULTIPLE =================
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeMultipleImage = (index) => {
    const imgs = [...images];
    const prev = [...previews];

    imgs.splice(index, 1);
    prev.splice(index, 1);

    setImages(imgs);
    setPreviews(prev);
  };

  // ✅ REMOVE EXISTING IMAGE FROM SERVER
  const removeExistingImage = async (imgName) => {
    try {
      await axios.put(
        `http://localhost:5000/api/gallery/delete-image/${editId}`,
        { imageName: imgName }
      );

      setExistingImages((prev) =>
        prev.filter((img) => img !== imgName)
      );

      toast.success("Image removed ❌");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  // ================= FETCH =================
  const fetchGallery = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gallery/all");
      setGalleryData(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch gallery ❌");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date) {
      return toast.error("Title & Date required ❌");
    }

    try {
      let galleryId = editId;

      // ===== CREATE =====
      if (!editId) {
        if (!image) {
          return toast.error("Cover image required ❌");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("eventDate", date);
        formData.append("coverImage", image);

        const res = await axios.post(
          "http://localhost:5000/api/gallery/create",
          formData
        );

        galleryId = res.data.galleryId;
      }

      // ===== UPDATE =====
      if (editId) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("eventDate", date);

        if (image) {
          formData.append("coverImage", image);
        }

        await axios.put(
          `http://localhost:5000/api/gallery/update/${editId}`,
          formData
        );
      }

      // ===== MULTIPLE IMAGES =====
      if (images.length > 0 && galleryId) {
        const imgData = new FormData();

        images.forEach((img) => {
          imgData.append("images", img);
        });

        await axios.post(
          `http://localhost:5000/api/gallery/upload-images/${galleryId}`,
          imgData
        );
      }

      toast.success(editId ? "Updated ✏️" : "Created 🎉");

      // RESET
      setTitle("");
      setDate("");
      setImage(null);
      setPreview(null);
      setImages([]);
      setPreviews([]);
      setExistingImages([]);
      setEditId(null);

      formRef.current?.reset();

      fetchGallery();
      setTab(2);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    }
  };

  // ================= DELETE =================
 const deleteGallery = (id) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <span>Are you sure you want to delete this gallery?</span>

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
              await axios.delete(
                `http://localhost:5000/api/gallery/delete/${id}`
              );
              toast.success("Deleted 🗑️");
              fetchGallery();
            } catch {
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

  // ================= EDIT =================
  const handleEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title);
    setDate(item.eventDate?.split("T")[0] || "");

    setPreview(`http://localhost:5000/file/files/${item.coverImage}`);

    // ✅ LOAD EXISTING IMAGES
    setExistingImages(item.photos || []);

    setTab(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-6">
          <h1 className="text-2xl font-bold">Event Gallery</h1>

          <div className="flex gap-4 mt-4">
            <button onClick={() => setTab(1)} className="bg-amber-400 px-4 py-2 rounded flex gap-2">
              <FaPlus /> Add
            </button>

            <button onClick={() => setTab(2)} className="bg-white text-black px-4 py-2 rounded flex gap-2">
              <FaEye /> View
            </button>
          </div>
        </div>

        {/* FORM */}
        {tab === 1 && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl max-w-xl mx-auto space-y-4"
          >

            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-3 rounded"
            />

            {/* COVER */}
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
              <div className="relative">
                <img src={preview} className="h-32 w-full object-cover rounded" />
                <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-black text-white px-2">✕</button>
              </div>
            )}

            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm mb-1">Existing Images:</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={`http://localhost:5000/file/files/${img}`}
                        className="h-24 w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="absolute top-1 right-1 bg-black text-white text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW MULTIPLE */}
            <input type="file" multiple accept="image/*" onChange={handleImagesChange} />

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="h-24 w-full object-cover rounded" />
                    <button type="button" onClick={() => removeMultipleImage(i)} className="absolute top-1 right-1 bg-black text-white text-xs px-2">✕</button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="w-full bg-amber-400 py-3 rounded font-bold">
              {editId ? "Update" : "Submit"}
            </button>

          </form>
        )}

        {/* VIEW */}
        {tab === 2 && (
          <div className="grid grid-cols-4 gap-4">
            {galleryData.map((item) => (
              <div key={item._id} className="bg-white p-3 rounded shadow">

                <img
                  src={`http://localhost:5000/file/files/${item.coverImage}`}
                  className="h-32 w-full object-cover rounded"
                />

                <h3 className="mt-2">{item.title}</h3>

                <p className="text-sm text-gray-500">
                  {new Date(item.eventDate).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {item.photos?.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000/file/files/${img}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ))}
                </div>

                <div className="flex justify-between mt-3">
                  <FaEdit className="cursor-pointer" onClick={() => handleEdit(item)} />
                  <FaTrash className="cursor-pointer text-red-500" onClick={() => deleteGallery(item._id)} />
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}