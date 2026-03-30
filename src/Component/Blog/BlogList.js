import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Header.js";
import Footer from "../Footer.js";
import Test from "../Test.js";
import { FaSearch, FaUserCircle } from "react-icons/fa";
const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  const getBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/blog/getall");
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  // 🔍 Search Filter
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* 🔥 HEADER + SEARCH */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

            <h1 className="text-3xl font-bold text-gray-800">
              Latest Blogs
            </h1>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d1a345]"
              />
            </div>
          </div>

          {/* 🧩 BLOG GRID */}
          {filteredBlogs.length === 0 ? (
            <p className="text-center text-gray-500">
              No blogs found 😢
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
                >
                  {/* IMAGE */}
                  <div className="overflow-hidden">
                    <img
                      src={`http://localhost:5000/file/files/${blog.blogimage}`}
                      alt={blog.title}
                      className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-4">

                    {/* 👤 ADMIN INFO */}
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                      <FaUserCircle className="text-lg" />
                      <span>
                        {blog.adminName || "Admin"}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                      {blog.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {blog.matter}
                    </p>

                    {/* BUTTON */}
                    <Link
                      to={`/blog/${blog._id}`}
                      className="inline-block mt-4 text-[#d1a345] font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <Test />
      <Footer />
    </>
  );
}