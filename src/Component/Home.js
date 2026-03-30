// ./Component/Home.js
import React from 'react';
import Header from '../Component/Header';
import Slider from '../Component/Slider';
import Products from '../Component/Products';
import Features from '../Component/Features';
import Reviews from '../Component/Reviews';
import InstagramFeed from '../Component/InstagramFeed';
import Newslatter from '../Component/Newslatter';
import Test from '../Component/Test';
import Footer from '../Component/Footer';

const Home = () => {
  return (
    <>
      <Header />

      {/* Hero Slider */}
      <Slider />

      {/* Store Section */}
      <section id="store">
        <Products />
      </section>

      <Features />
      {/* <Reviews />
      <hr className="w-full border-gray-300 border-t" /> */}
      <InstagramFeed />
      <hr className="w-full border-gray-300 border-t" />
      {/* <Newslatter /> */}
      <Test />
      <Footer />
    </>
  );
};

export default Home;