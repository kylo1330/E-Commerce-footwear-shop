import React from 'react';
import { Carousel } from 'react-bootstrap';
import './ShopCarousel.css'; // Import your custom CSS for styling

const ShopCarousel = () => {
  return (
    <div className="shop-carousel-container">
      <Carousel interval={3000}  controls={false}  prevIcon={null} nextIcon={null} className="custom-carousel">
        <Carousel.Item>
          <div className="carousel-item-wrapper">
            <img
              src="https://coreldrawdesign.com/resources/previews/preview-corporate-sports-shoes-advertisement-promotional-banner-vector-1657725850.jpg"
              width="250"
              height="300"
              alt="First slide"
            />
            <img
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/shoe-sale-instagram-design-template-b127a8ae3ffeb1e0abba6ac5c41bd567_screen.jpg?ts=1615386905"
              width="250"
              height="300"
              alt="Second slide"
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-item-wrapper">
            <img
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/shoe-sale-design-template-bcfc858ad93cb066bffe1294d1b166b0_screen.jpg?ts=1637024676"
              width="250"
              height="300"
              alt="Third slide"
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfDbTQTFLxFqRNd4CLZdr9rjNhxXQv8w6gfg&s"
              width="250"
              height="300"
              alt="Fourth slide"
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-item-wrapper">
            <img
              src="https://img.pikbest.com/origin/06/21/44/37jpIkbEsT5DS.jpg!w700wp"
              width="250"
              height="300"
              alt="Third slide"
            />
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/00f0f138345237.575eb54b66af9.jpg"
              width="250"
              height="300"
              alt="Fourth slide"
            />
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ShopCarousel;
