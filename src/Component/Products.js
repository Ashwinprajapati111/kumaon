import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Component/Header.js";
import Footer from "../Component/Footer.js";
import Test from "../Component/Test.js";
import axios from "axios";

export default function Example() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const showdata = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/getall");
      setProducts(res.data.reverse());
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showdata();
  }, []);

  return (
    <>
      {/* <Header /> */}

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Top Section */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-block rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600 shadow-sm">
                Explore Collection
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Our Products
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500">
                Discover our latest products with a clean and modern shopping
                experience.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              Total Products:{" "}
              <span className="font-semibold text-slate-800">
                {products.length}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-44 sm:h-52 animate-pulse bg-slate-200" />
                  <div className="p-4">
                    <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Link
                        to={`/Product_details/${product._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className="block overflow-hidden"
                      >
                        <div className="relative overflow-hidden bg-slate-100">
                          <img
                            src={`http://localhost:5000/file/files/${product.productimage}`}
                            alt={product.name}
                            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-52"
                          />

                          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />


                        </div>
                      </Link>

                      <div className="p-4 sm:p-5">
                        <h3 className="line-clamp-1 text-sm sm:text-base font-semibold text-slate-800 transition-colors duration-300 group-hover:text-amber-500">
                          {product.name}
                        </h3>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-base sm:text-lg font-bold text-slate-900">
                            ₹{product.price}
                          </p>

                          <Link
                            to={`/Product_details/${product._id}`}
                            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-amber-500"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No products found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Please check back later for new arrivals.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}