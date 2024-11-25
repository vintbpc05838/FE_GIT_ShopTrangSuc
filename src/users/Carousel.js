import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import carousel1 from '../images/carousel-1.webp';
import carousel2 from '../images/carousel-2.webp';
// import carousel3 from '../images/carousel-3.webp';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        // { src: carousel3},
        { src: carousel2},
        { src: carousel1}
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // chuyển động tự động mỗi 5 giây

        return () => clearInterval(interval);
    }, [images.length]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="container-fluid carousel-header px-0">
            <div id="carouselId" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${currentIndex === index ? 'active' : ''}`}
                        >
                            <img src={image.src} alt={image.title}    style={{ height: '500px',width: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" onClick={handlePrev}>
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" onClick={handleNext}>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default Carousel;