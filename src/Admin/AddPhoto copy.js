import Admin_test from './Admin_test';
import React, { useState, useRef,useMemo  } from "react";

import { FaEdit, FaTrash } from "react-icons/fa";
import './Mycss.css';
import { useParams } from "react-router-dom";
import Data from "../Data.json";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Example() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove Selected Image
  const handleCancelImage = () => {
    setImage(null);
    setPreview(null);
    fileInputRef.current.value = "";
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("image", image);

    console.log("Event Title:", title);
    console.log("Event Date:", date);
    console.log("Image:", image);

    alert("Event Photo Added Successfully");

    // 👉 Connect backend here
    // axios.post("http://localhost:5000/upload", formData)
  };
// content of tab 2
 const [galleries, setGalleries] = useState([
        {
            id: 1,
            title: "Organic Farming Workshop",
            year: 2026,
            date: "2026-02-15",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 2,
            title: "Honey Harvest Event",
            year: 2025,
            date: "2025-01-10",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 3,
            title: "Village Awareness Program",
            year: 2024,
            date: "2024-03-12",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 4,
            title: "Organic Expo",
            year: 2026,
            date: "2026-01-20",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 5,
            title: "Organic Farming Workshop",
            year: 2026,
            date: "2026-02-15",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 6,
            title: "Honey Harvest Event",
            year: 2025,
            date: "2025-01-10",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 7,
            title: "Village Awareness Program",
            year: 2024,
            date: "2024-03-12",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 8,
            title: "Organic Expo",
            year: 2026,
            date: "2026-01-20",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 9,
            title: "Organic Farming Workshop",
            year: 2026,
            date: "2026-02-15",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 10,
            title: "Honey Harvest Event",
            year: 2025,
            date: "2025-01-10",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 11,
            title: "Village Awareness Program",
            year: 2024,
            date: "2024-03-12",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 12,
            title: "Organic Expo",
            year: 2026,
            date: "2026-01-20",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
    ]);

    const [filterYear, setFilterYear] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    // Unique Years
    const years = [...new Set(galleries.map((g) => g.year))];

    // Delete Gallery
    const handleDelete = (id) => {
        if (window.confirm("Delete this gallery?")) {
            setGalleries(galleries.filter((g) => g.id !== id));
        }
    };

    // Edit Gallery
    const handleEdit = (id) => {
        alert("Edit Gallery ID: " + id);
    };

    // Filter + Sort Logic
    const filteredData = useMemo(() => {
        let data = [...galleries];

        if (filterYear !== "All") {
            data = data.filter((g) => g.year === Number(filterYear));
        }

        data.sort((a, b) =>
            sortOrder === "latest"
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date)
        );

        return data;
    }, [galleries, filterYear, sortOrder]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );
  const [tab, setTab] = useState(1);

  // import data
  const { id } = useParams();

  const photo = Data[0].photogallery;

  const gallery = photo.find(
    (item) => item.id === parseInt(id)
  );
  console.log(photo)

  return (
    <div className="bg-gray-100">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className=" items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="col-span-4 text-4xl font-bold tracking-tight text-gray-900">Photo Galleries</h1>
              <div className=" flex flex-col sm:flex-row gap-3">


                <button className=" flex items-center  bg-[#d1a345] text-black px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-yellow-700 transition duration-300"
                onClick={() => setTab(2)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mr-4">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                  </svg>
                

                  View Gallery
                </button>
                <button className="flex items-center bg-[#d1a345] text-black px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-yellow-700 transition duration-300"
                onClick={() => setTab(1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                  Add Gallery
                </button>
              </div>
            </div>
          </div>


          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            {tab === 1 &&
              <div className="h-auto bg-gray-100 flex content-between justify-center p-6">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full">


                  <h2 className="text-2xl font-bold text-left text-black mb-6">
                    Add Event Photo Gallery
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Event Title */}
                    <div>
                      <label className="block font-medium mb-2">
                        Event Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter event title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>

                    {/* Event Date */}
                    <div>
                      <label className="block font-medium mb-2">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>

                    {/* Single Image Upload */}
                    <div>
                      <label className="block font-medium mb-2">
                        Upload Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Image Preview Section */}
                    {preview && (
                      <div className="relative">
                        <p className="mb-2 font-medium">Preview:</p>
                        <img
                          src={preview}
                          alt="preview"
                          className="h-48 w-full object-cover rounded-lg shadow"
                        />

                        {/* Cancel Button */}
                        <button
                          type="button"
                          onClick={handleCancelImage}
                          className="absolute top-8 right-2 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleCancelImage}
                      type="submit"
                      className="w-full bg-[#d1a345] text-black px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-yellow-700 transition duration-300 mb-6"
                    >
                      Add Event Photo Gallery
                    </button>

                  </form>
                </div>
              </div>
            }
            {tab === 2 &&
              <div className="min-h-screen bg-gray-100 p-1">
                <div className="bg-white shadow-xl rounded-2xl p-4 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-left text-black mb-6">
                    View Event Photo Gallery
                  </h2>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <select
                      value={filterYear}
                      onChange={(e) => {
                        setFilterYear(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border p-2 rounded-lg"
                    >
                      <option value="All">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sortOrder}
                      onChange={(e) => {
                        setSortOrder(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border p-2 rounded-lg"
                    >
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>

                  {/* Table */}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="tabtop text-black">
                          <th className="p-3">Thumbnail</th>
                          <th className="p-3 text-left">Title</th>
                          <th className="p-3 text-center">Year</th>
                          <th className="p-3 text-center">Date</th>
                          <th className="p-3 text-center">Date</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedData.map((gallery) => (
                          <tr key={gallery.id} className="border-b hover:bg-gray-50">

                            {/* Thumbnail */}
                            <td className="p-3 text-center">
                              <img
                                src={gallery.thumbnail}
                                alt="thumbnail"
                                className="h-16 w-16 object-cover rounded-lg mx-auto"
                              />
                            </td>

                            <td className="p-3">{gallery.title}</td>
                            <td className="p-3 text-center">{gallery.year}</td>
                            <td className="p-3 text-center">{gallery.date}</td>
                            <td className="p-3 text-center">{gallery.date}</td>

                            {/* Actions */}
                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-4 text-lg">
                                <button
                                  onClick={() => handleEdit(gallery.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  onClick={() => handleDelete(gallery.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}

                        {paginatedData.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center p-4 text-gray-500">
                              No Galleries Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center mt-6 gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded ${currentPage === index + 1
                          ? "tabtop text-black"
                          : "bg-gray-200"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>

                </div>
              </div>
            }

          </section>
        </main>
      </div>
    </div >
  )
}
