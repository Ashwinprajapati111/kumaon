import React from 'react'
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Header from '../Header.js';
import Footer from '../Footer.js';
import Test from '../Test.js';
import Admin_test from '../../Admin/Admin_test.js';
'use client'

import { useState } from 'react'
import Data from "../../TestData.json";
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


import { Link } from "react-router-dom";


import VideoGallery from './VideoGallery.js'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Eventsvideo = () => {
 
  const sortOption = Data[0].sortOption;
  return (
    <>
      <Header />
      <div className="bg-white">
        <div>



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
                <VideoGallery />
                <div className="lg:col-span-3">{/* Your content */}</div>
              </div>
            </section>
          </main>
        </div>
      </div>
      <Test />
      <Footer />
    </>
  )
}

export default Eventsvideo
