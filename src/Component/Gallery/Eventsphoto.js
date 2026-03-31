import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header.js";
import Footer from "../Footer.js";
import Test from "../Test.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Eventsphoto = () => {
  const [gallery, setGallery] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ================= FETCH =================
  const fetchGallery = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/gallery/all"
      );

      // only needed fields
      const data = res.data.map((item) => ({
        _id: item._id,
        title: item.title,
        coverImage: item.coverImage,
        eventDate: item.eventDate,
      }));

      setGallery(data);
      setFiltered(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ================= SEARCH + SORT =================
  const navigate = useNavigate();
  useEffect(() => {
    let data = [...gallery];

    // 🔍 SEARCH
    if (search) {
      data = data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔽 SORT
    if (sort === "latest") {
      data.sort(
        (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
      );
    }

    if (sort === "oldest") {
      data.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );
    }

    if (sort === "year") {
      data.sort(
        (a, b) =>
          new Date(b.eventDate).getFullYear() -
          new Date(a.eventDate).getFullYear()
      );
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, sort, gallery]);

  // ================= PAGINATION =================
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <Header />

      <div className="bg-white">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pt-24 pb-6 gap-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Photo Gallery
            </h1>

            {/* CONTROLS */}
            <div className="flex flex-wrap gap-3">

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-md text-sm"
              />

              {/* SORT */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border px-3 py-2 rounded-md text-sm"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>

          {/* GRID */}
          <section className="pt-6 pb-24">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
                  onClick={() => navigate(`/photo/${item._id}`)}
                >
                  <img
                    src={`http://localhost:5000/file/files/${item.coverImage}`}
                    className="h-40 w-full object-cover rounded-lg"
                    alt={item.title}
                  />

                  <h3 className="mt-2 font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(item.eventDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={classNames(
                      "px-3 py-1 rounded",
                      currentPage === i + 1
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}

              </div>
            )}
          </section>
        </main>
      </div>

      <Test />
      <Footer />
    </>
  );
};

export default Eventsphoto;