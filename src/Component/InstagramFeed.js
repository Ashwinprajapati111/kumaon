'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InstagramFeed() {
  const [instagramPosts, setInstagramPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/insta/all");
        // Make sure instagramPosts is always an array
        setInstagramPosts(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Error fetching Instagram posts:", err);
        setInstagramPosts([]);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const loadInstagram = () => {
      if (!window.instgrm) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          setTimeout(() => {
            window.instgrm?.Embeds.process();
          }, 300);
        };
        document.body.appendChild(script);
      } else {
        setTimeout(() => {
          window.instgrm.Embeds.process();
        }, 300);
      }
    };

    if (instagramPosts.length) loadInstagram();
  }, [instagramPosts]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">From Our Instagram</h2>
        <p className="mt-2 text-gray-600">
          A glimpse into the Himalayan lifestyle & our authentic Kumaon products.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl shadow-lg border bg-white overflow-hidden"
            >
              <div
                className="w-full flex justify-center"
                dangerouslySetInnerHTML={{
                  __html: `
                    <blockquote 
                      class="instagram-media"
                      data-instgrm-permalink="${post.videoUrl}"
                      data-instgrm-version="14"
                      style="background:#FFF; border:0; margin:0 auto; width:100%; max-width:100%;">
                    </blockquote>
                  `
                }}
              />
            </div>
          ))}
        </div>

        <a
          href="https://www.instagram.com/kumaonorganics/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block px-6 py-2 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition-colors"
        >
          Follow Us
        </a>
      </div>
    </section>
  );
}