import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminGallery() {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [galleryId, setGalleryId] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCover, setEditCover] = useState(null);
  const [editImages, setEditImages] = useState([]);

  const [expandedGallery, setExpandedGallery] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const galleriesPerPage = 8;

  const BASE_URL = "http://localhost:5000/api/gallery";
  const IMG_URL = "http://localhost:5000/uploads/";

  // FETCH
  const fetchGalleries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      setGalleries(res.data || []);
    } catch {
      alert("❌ Failed to load galleries");
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // CREATE
  const createGallery = async () => {
    if (!title || !coverImage || !eventDate) {
      return alert("Fill all fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("eventDate", eventDate);
    formData.append("coverImage", coverImage);

    try {
      const res = await axios.post(`${BASE_URL}/create`, formData);

      setGalleryId(res.data.galleryId);
      setTitle("");
      setEventDate("");
      setCoverImage(null);

      fetchGalleries();
    } catch {
      alert("❌ Create failed");
    }
  };

  // UPLOAD
  const uploadImages = async () => {
    if (!galleryId) return alert("Create gallery first");

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post(`${BASE_URL}/upload-images/${galleryId}`, formData);
      setImages([]);
      fetchGalleries();
    } catch {
      alert("❌ Upload failed");
    }
  };

  // DELETE GALLERY
  const deleteGallery = async (id) => {
    await axios.delete(`${BASE_URL}/delete/${id}`);
    fetchGalleries();
  };

  // DELETE IMAGE
  const deleteImage = async (id, img) => {
    await axios.put(`${BASE_URL}/delete-image/${id}`, {
      imageName: img,
    });
    fetchGalleries();
  };

  // UPDATE
  const updateGallery = async (id) => {
    const formData = new FormData();

    if (newTitle) formData.append("title", newTitle);
    if (editDate) formData.append("eventDate", editDate);
    if (editCover) formData.append("coverImage", editCover);

    editImages.forEach((img) => formData.append("images", img));

    await axios.put(`${BASE_URL}/update/${id}`, formData);

    setEditingId(null);
    setEditImages([]);
    setEditCover(null);
    setNewTitle("");
    setEditDate("");

    fetchGalleries();
  };

  // FILTER
  const filtered = galleries.filter((g) =>
    (g.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const indexOfLast = currentPage * galleriesPerPage;
  const indexOfFirst = indexOfLast - galleriesPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / galleriesPerPage);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 w-full mb-4 rounded text-sm"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CREATE */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2 text-sm"
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="border p-2 w-full mb-2 text-sm"
        />

        <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} />

        <button
          onClick={createGallery}
          className="bg-blue-600 text-white px-3 py-1 mt-2 rounded text-sm"
        >
          Create
        </button>
      </div>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              className="h-14 object-cover rounded"
              alt=""
            />
          ))}
        </div>

        <button
          onClick={uploadImages}
          className="bg-green-600 text-white px-3 py-1 mt-2 rounded text-sm"
        >
          Upload
        </button>
      </div>

      {/* GALLERY */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {current.map((gallery) => {
          const photos = gallery.photos || [];
          const isExpanded = expandedGallery === gallery._id;
          const visible = isExpanded ? photos : photos.slice(0, 3);

          return (
            <div key={gallery._id} className="bg-white p-2 rounded shadow-sm text-sm">

              <img
                src={`${IMG_URL}${gallery.coverImage}`}
                className="h-24 w-full object-cover rounded"
                alt=""
              />

              <h3 className="text-sm font-semibold truncate mt-1">
                {gallery.title}
              </h3>

              <p className="text-xs text-gray-500">
                {gallery.eventDate
                  ? new Date(gallery.eventDate).toDateString()
                  : "No date"}
              </p>

              {/* BUTTONS */}
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => {
                    setEditingId(gallery._id);
                    setNewTitle(gallery.title);
                    setEditDate(
                      gallery.eventDate
                        ? new Date(gallery.eventDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    );
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-2 py-1 rounded-full text-xs"
                >
                  ✏️
                </button>

                <button
                  onClick={() => deleteGallery(gallery._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-white hover:bg-red-600 border border-red-500 px-2 py-1 rounded-full text-xs"
                >
                  🗑
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="grid grid-cols-3 gap-1 mt-2">
                {visible.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={`${IMG_URL}${img}`}
                      className="h-14 object-cover rounded"
                      alt=""
                    />
                    <button
                      onClick={() => deleteImage(gallery._id, img)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {photos.length > 3 && (
                <button
                  onClick={() =>
                    setExpandedGallery(isExpanded ? null : gallery._id)
                  }
                  className="text-blue-600 text-xs mt-1"
                >
                  {isExpanded ? "Less" : "More"}
                </button>
              )}

            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md p-5 rounded-lg shadow-lg">

            <h2 className="text-lg font-semibold mb-3">Edit Gallery</h2>

            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border p-2 w-full mb-2 text-sm"
            />

            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border p-2 w-full mb-2 text-sm"
            />

            <input
              type="file"
              onChange={(e) => setEditCover(e.target.files[0])}
              className="mb-2"
            />

            <input
              type="file"
              multiple
              onChange={(e) => setEditImages([...e.target.files])}
              className="mb-3"
            />

            <div className="grid grid-cols-4 gap-2 mb-3">
              {editImages.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="h-14 object-cover rounded"
                  alt=""
                />
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => updateGallery(editingId)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 text-xs border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}