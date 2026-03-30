import React, { useState } from "react";
import Admin_test from './Admin_test';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
function Component1() {
  return <h2>This is Component 1</h2>;
}

function Component2() {
  return <h2>This is Component 2</h2>;
}

function Component3() {
  return <h2>This is Component 3</h2>;
}

export default function Example() {
    const [tab, setTab] = useState(1);

    return (
        <div className="bg-white">
            <div>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Photo Gallery</h1>


                    </div>

                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <div className="flex gap-4 mb-5">
                            <button onClick={() => setTab(1)}>Tab 1</button>
                            <button onClick={() => setTab(2)}>Tab 2</button>
                            <button onClick={() => setTab(3)}>Tab 3</button>
                        </div>

                        {/* Content */}
                        {tab === 1 && <Component1 />}
                        {tab === 2 && <Component2 />}
                        {tab === 3 && <Admin_test />}

                    
                </section>
            </main>
        </div>
        </div >
    )
}







import Admin_test from './Admin_test';
import React, { useState, useRef } from "react";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function Component1() {
  return <h2>This is Component 1</h2>;
}

function Component2() {
  return <h2>This is Component 2</h2>;
}

function Component3() {
  return <h2>This is Component 3</h2>;
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


  return (
    <div className="bg-white">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Photo Gallery</h1>


          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <div className="h-auto bg-gray-100 flex content-between justify-center p-6">
              <div className="bg-white shadow-xl rounded-2xl p-8 w-full">

                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
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
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Add Event Photo
                  </button>

                </form>
              </div>
            </div>


          </section>
        </main>
      </div>
    </div >
  )
}
