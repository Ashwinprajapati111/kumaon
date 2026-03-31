import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from '../Header.js';
import Footer from '../Footer.js';
import Test from '../Test.js';

function GalleryPage() {
  const { id } = useParams();

  const [gallery, setGallery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ================= FETCH =================
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/gallery/${id}`);
        const data = await res.json();
        setGallery(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchGallery();
  }, [id]);

  // ================= KEYBOARD NAV =================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, gallery]);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    if (!gallery) return;
    setCurrentIndex(prev => prev === gallery.photos.length - 1 ? 0 : prev + 1);
  };

  const prevImage = () => {
    if (!gallery) return;
    setCurrentIndex(prev => prev === 0 ? gallery.photos.length - 1 : prev - 1);
  };

  if (!gallery) return <h2 className="p-10">Loading...</h2>;

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Photo Gallery</h1>
        </div>

        <section className="pt-6 pb-24">
          <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">{gallery.title}</h1>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.photos?.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => openModal(index)}
                  className="cursor-pointer overflow-hidden rounded-xl shadow-lg"
                >
                  <img
                    src={`http://localhost:5000/file/files/${photo}`}
                    alt="Gallery"
                    className="w-full h-64 object-cover hover:scale-110 transition duration-300"
                  />
                </div>
              ))}
            </div>

            {/* MODAL */}
            {isOpen && (
              <div className="fixed z-50 inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 md:p-0">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-black text-4xl md:text-2xl font-bold !important"
                  style={{ color: 'black' }} // force black color
                  aria-label="Close"
                >
                  ✖
                </button>

                {/* Left Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-6 text-white text-4xl md:text-5xl font-bold"
                  aria-label="Previous"
                >
                  ❮
                </button>

                {/* Image */}
                <img
                  src={`http://localhost:5000/file/files/${gallery.photos[currentIndex]}`}
                  alt="Full"
                  className="max-h-[80vh] max-w-full object-contain rounded-lg"
                />

                {/* Right Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-6 text-white text-4xl md:text-5xl font-bold"
                  aria-label="Next"
                >
                  ❯
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Test />
      <Footer />
    </>
  );
}

export default GalleryPage;