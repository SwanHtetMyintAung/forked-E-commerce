import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import carosel1 from "../../public/images/lucrezia-carnelos-wQ9VuP_Njr4-unsplash.jpg";
import carosel2 from "../../public/images/markus-spiske-wL7pwimB78Q-unsplash.jpg";
import carosel3 from "../../public/images/visuals-IVqug9_5fNs-unsplash.jpg";
import "./CarouselImage.css";

function CarouselImage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Update the current active slide index
  const handleSelect = (selectedIndex) => {
    setCurrentSlide(selectedIndex);
  };

  return (
    <Carousel
      interval={3000}
      fade
      controls={false}
      onSelect={handleSelect}
    >
      <Carousel.Item>
        <div className="d-flex align-items-center carousel-content">
          <div
            className={`text-left w-25 mx-auto p-4 ${
              currentSlide === 0 ? "animate-slide-left" : ""
            }`}
          >
            <h3 className={`${currentSlide === 0 ? "animate-fade-in" : ""}`}>
              First Slide
            </h3>
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
          <div
            className={`image-right w-50 ${
              currentSlide === 0 ? "animate-fade-in" : ""
            }`}
          >
            <img
              className="d-block w-100"
              src={carosel1}
              alt="First slide"
              style={{ height: "400px", objectFit: "cover" }}
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="d-flex align-items-center carousel-content">
          <div
            className={`text-left w-25 mx-auto p-4 ${
              currentSlide === 1 ? "animate-slide-left" : ""
            }`}
          >
            <h3 className={`${currentSlide === 1 ? "animate-fade-in" : ""}`}>
              Second Slide
            </h3>
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
          <div
            className={`image-right w-50 ${
              currentSlide === 1 ? "animate-slide-right" : ""
            }`}
          >
            <img
              className="d-block w-100"
              src={carosel2}
              alt="Second slide"
              style={{ height: "400px", objectFit: "cover" }}
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="d-flex align-items-center carousel-content">
          <div
            className={`text-left w-25 mx-auto p-4 ${
              currentSlide === 2 ? "animate-slide-left" : ""
            }`}
          >
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
          <div
            className={`image-right w-50 ${
              currentSlide === 2 ? "animate-fade-in" : ""
            }`}
          >
            <img
              className="d-block w-100"
              src={carosel3}
              alt="Third slide"
              style={{ height: "400px", objectFit: "cover" }}
            />
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselImage;
