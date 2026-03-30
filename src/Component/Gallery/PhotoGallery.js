import React from "react";
// If using React Router, uncomment below
import { Link } from "react-router-dom";
import Data from "../../TestData.json";





function PhotoGallery () {

const photo = Data[0].photogallery;
console.log(photo)
  return (
    <div className="container max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
       Events Gallery
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photo.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            {/* Image */}
            <img
              src={`${item.photo}?auto=format&fit=crop&w=800&q=80`}
              alt={item.title}
              className="w-full h-64 object-cover hover:scale-105 transition duration-500"
            />

            {/* Title Below Image */}
            <div className="p-4 text-center">

              {/* Normal hyperlink */}
              {/* <a
                href={item.link}
                className="text-xl font-semibold text-green-700 hover:text-green-500 transition"
              >
                {item.title}
              </a> */}

              {/* If using React Router, use this instead */}

              <Link
                to={`/PhotoDetails/${item.id}`}
                className="text-xl font-semibold text-green-700 hover:text-green-500 transition"

              >
                {item.title}
              </Link>

            </div>


          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
