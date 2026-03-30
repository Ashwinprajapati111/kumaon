import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import galleryData from "../../TestData.json";
import Header from '../Header.js';
import Footer from '../Footer.js';
import Test from '../Test.js';
import Data from "../../Data.json";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const sortOption = Data[0].sortOption;





function GalleryPage() {
  const { id } = useParams();

  const photo = galleryData[0].videogallery;

  const gallery = photo.find(
    (item) => item.id === parseInt(id)
  );
  console.log(gallery)
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!gallery) return <h2 className="p-10">Gallery Not Found</h2>;
  const closeModal = () => setIsOpen(false);
  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === gallery.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? gallery.photos.length - 1 : prev - 1
    );
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Photo Gallery</h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {sortOption.map((option) => (
                    <MenuItem key={option.id}>
                      <Link
                        to={option.href}
                        className={classNames(
                          option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                          'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                        )}
                      >
                        {option.name}
                      </Link>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
              <span className="sr-only">View grid</span>
              <Squares2X2Icon aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
            >

            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div>
            {/* Filters */}


            {/* Product grid */}
            <div className="lg:col-span-3">{/* Your content */}</div>
            <div className="p-10">
              <h1 className="text-3xl font-bold mb-6">
                {gallery.title}
              </h1>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.photos.map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => openModal(index)}
                    className="cursor-pointer overflow-hidden rounded-xl shadow-lg"
                  >
                    <img
                      src={photo}
                      alt="Gallery"
                      className="w-full h-64 object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Modal */}
              {isOpen && (
                <div className="fixed z-40 inset-0 bg-black bg-opacity-80 flex items-center justify-center">

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 text-white text-3xl"
                  >
                    ✖
                  </button>

                  {/* Left Arrow */}
                  <button
                    onClick={prevImage}
                    className="absolute left-6 text-white text-4xl"
                  >
                    ❮
                  </button>

                  {/* Image */}
                  <img
                    src={gallery.photos[currentIndex]}
                    alt="Full"
                    className="max-h-[80%] rounded-lg"
                  />

                  {/* Right Arrow */}
                  <button
                    onClick={nextImage}
                    className="absolute right-6 text-white text-4xl"
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Test />
      <Footer />
    </>
  );
}

export default GalleryPage;
