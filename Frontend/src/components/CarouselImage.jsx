import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import carosel1 from "../../public/images/lucrezia-carnelos-wQ9VuP_Njr4-unsplash.jpg";
import carosel2 from "../../public/images/markus-spiske-wL7pwimB78Q-unsplash.jpg";
import carosel3 from "../../public/images/visuals-IVqug9_5fNs-unsplash.jpg";
import "../../public/css/CarouselImage.css";

function CarouselImage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSelect = (selectedIndex) => {
    setCurrentSlide(selectedIndex);
  };

  return (
    <Carousel interval={3000} fade controls={false} onSelect={handleSelect}>
      {/* First Slide */}
      <Carousel.Item>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-container">
            <p className={`fs-5 ${currentSlide === 0 ? "animate-slide-up" : ""}`}>
              At Mega Mart (Myanmar), we specialize in delivering innovative
              solutions to meet your unique needs.
            </p>
            <p className={`fs-5 ${currentSlide === 0 ? "animate-slide-up" : ""}`}>
              Whether you're seeking cutting-edge technology, reliable services,
              or unparalleled expertise, we are here to ensure your success.
            </p>
            <p className={`fs-5 ${currentSlide === 0 ? "animate-slide-up" : ""}`}>
              Discover the difference with a partner that puts you first.
            </p>
            </div>
            <div className="col-12 col-md-6 image-container">
              <img
                className="img-fluid"
                src={carosel1}
                alt="First slide"
              />
            </div>
          </div>
        </div>
      </Carousel.Item>

      {/* Second Slide */}
      <Carousel.Item>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-container">
            <p className={`fs-5 ${currentSlide === 1 ? "animate-slide-up" : ""}`}>
              We are dedicated to empowering businesses and individuals by
              providing tailored solutions that drive growth, efficiency, and
              innovation.
            </p>
            <p className={`fs-5 ${currentSlide === 1 ? "animate-slide-up" : ""}`}>
              With a focus on excellence and sustainability, we strive to
              exceed expectations and build lasting relationships.
            </p>
            </div>
            <div className="col-12 col-md-6 image-container">
              <img
                className="img-fluid"
                src={carosel2}
                alt="Second slide"
              />
            </div>
          </div>
        </div>
      </Carousel.Item>

      {/* Third Slide */}
      <Carousel.Item>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-container">
            <p className={`fs-5 ${currentSlide === 2 ? "animate-slide-up" : ""}`}>
              Expertise You Can Trust:<br />
              Decades of experience in Mega Mart (Myanmar).
            </p>
            <p className={`fs-5 ${currentSlide === 2 ? "animate-slide-up" : ""}`}>
              Customized Solutions:<br />
              Designed to meet your specific goals.
            </p>
            <p className={`fs-5 ${currentSlide === 2 ? "animate-slide-up" : ""}`}>
              Unmatched Support:<br />
              A team that's always by your side.
            </p>
            </div>
            <div className="col-12 col-md-6 image-container">
              <img
                className="img-fluid"
                src={carosel3}
                alt="Third slide"
              />
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselImage;

