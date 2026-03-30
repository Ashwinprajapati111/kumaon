import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";

const Slider = () => {

  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSliders = async () => {
    try {

      const res = await axios.get("http://localhost:5000/slider/getall");

      setSliders(res.data);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching sliders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading slider...</div>;
  }

  return (
    <Carousel
      showThumbs={false}
      autoPlay
      interval={4000}
      transitionTime={600}
      infiniteLoop
    >

      {sliders.length > 0 && sliders.map((slider) => (
        <div key={slider._id}>
          <img
            src={`http://localhost:5000/file/files/${slider.sliderimage}`}
            alt="slider"
            className="w-full h-[500px] object-cover"
          />
        </div>
      ))}

    </Carousel>
  );
};

export default Slider;