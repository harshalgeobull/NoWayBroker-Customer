import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const Banner = () => {
  return (
    <Carousel showArrows={true} infiniteLoop={true} autoPlay={true}>
      <div>
        <img src="image1.jpg" alt="Slide 1" />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src="image2.jpg" alt="Slide 2" />
        <p className="legend">Legend 2</p>
      </div>
      <div>
        <img src="image3.jpg" alt="Slide 3" />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
};

export default Banner;
