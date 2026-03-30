import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../Header.js";
import Footer from "../Footer.js";
import Test from "../Test.js";
import { FaShareAlt, FaWhatsapp } from "react-icons/fa";

export default function BlogDetails() {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/blog/get/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500 animate-pulse">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center mt-10">Blog not found</p>;
  }

  // ❤️ Like toggle
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  // 🔗 Copy link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied 🔗");
  };

  // 📱 WhatsApp share
  const shareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  // 💬 Add comment
  const handleComment = () => {
    if (!commentInput.trim()) return;

    const newComment = {
      text: commentInput,
      date: new Date().toLocaleString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput("");
  };

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4">

          {/* HERO */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            {blog.blogimage && (
              <img
                src={`http://localhost:5000/file/files/${blog.blogimage}`}
                alt={blog.title}
                className="w-full h-[300px] object-cover"
              />
            )}

            <div className="p-6">
              <h1 className="text-4xl font-bold mb-3 text-gray-800">
                {blog.title}
              </h1>

              {blog.matter && (
                <p className="text-gray-600 leading-7">
                  {blog.matter}
                </p>
              )}
            </div>
          </div>

          {/* ❤️ LIKE + SHARE */}
          <div className="bg-white p-5 rounded-2xl shadow mb-6 flex flex-wrap gap-4 justify-between items-center">

            <div className="flex gap-4 items-center">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${liked ? "bg-red-500 text-white" : "bg-gray-200"
                  }`}
              >
                ❤️ {likes}
              </button>
            </div>

            <div className="flex gap-3">

              {/* Share (Copy Link) */}
              <button
                onClick={handleShare}
                className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
                title="Copy Link"
              >
                <FaShareAlt className="text-gray-700 text-lg" />
              </button>

              {/* WhatsApp Share */}
              <button
                onClick={shareWhatsApp}
                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="text-lg" />
              </button>

            </div>

          </div>

          {/* 🧩 CONTENT SECTIONS */}
          <div className="space-y-6">
            {!blog.subtitle || blog.subtitle.length === 0 ? (
              <p className="text-center text-gray-500">
                No sections found
              </p>
            ) : (
              blog.subtitle.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                    {item.subtitlein}
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {item.subtitlematter}
                  </p>
                </div>
              ))
            )}
          </div>


        </div>



        <div className="bg-white p-6 rounded-2xl shadow mt-10">
          <h2 className="text-xl font-bold mb-4">Comments</h2>

          {/* INPUT */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-xl px-4 py-2"
            />
            <button
              onClick={handleComment}
              className="bg-black text-white px-4 rounded-xl"
            >
              Post
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="border p-3 rounded-xl">
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Test />
      <Footer />
    </>
  );
}