import React from 'react';
import Logo from '../Images/Logo.png'
import '../Component/mycss.css';
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaYoutube
} from "react-icons/fa";



export default function Example() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* LOGO + ABOUT */}
          <div>
            <img src={Logo} className="h-12 mb-4" alt="logo" />
            <p className="text-sm text-gray-400 leading-6">
              Premium organic products from the Himalayas. Pure, natural,
              and crafted with care for your wellness.
            </p>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Black Tea</a></li>
              <li><a href="#" className="hover:text-white">White Tea</a></li>
              <li><a href="#" className="hover:text-white">Honey</a></li>
              <li><a href="#" className="hover:text-white">Herbal Tea</a></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Blogs</a></li>
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Subscribe
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Get latest updates & offers.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none"
              />
              <button className="bg-[#d1a345] px-4 rounded-r-lg text-black font-semibold hover:bg-yellow-500">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">

          {/* COPYRIGHT */}
          <p className="text-sm text-gray-500">
            © 2026 Kumaon Organics. All rights reserved.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://www.instagram.com/kumaonorganics/" target="_blank" className="hover:text-white"><FaInstagram className="cursor-pointer hover:text-pink-500" /></a>
            <a href="#" className="hover:text-white" target="_blank" ><FaWhatsapp className="cursor-pointer hover:text-green-500" /></a>
            <a href="#" className="hover:text-white" target="_blank" > <FaFacebookF className="cursor-pointer hover:text-blue-500" /></a>
            <a href="https://www.youtube.com/channel/UC3RwdDk0LolWaNfnx1Su3vw" target="_blank"  className="hover:text-white"> <FaYoutube className="cursor-pointer hover:text-red-500" /></a>
          </div>
        </div>

      </div>
    </footer>
  )
}
