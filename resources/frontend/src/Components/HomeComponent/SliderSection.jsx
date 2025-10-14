import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const calculateDiscount = (price, originalPrice) => {
    const p = parseFloat(price.replace('$', ''));
    const op = parseFloat(originalPrice.replace('$', ''));

    if (op <= p) return 0;

    const discount = ((op - p) / op) * 100;
    return Math.round(discount);
};

function SliderSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const isAutoPlay = true;
    const autoPlayRef = useRef(null);

    const heroSlides = [
        {
            id: 1,
            title: "Smart Watch Series 7",
            description:
                "Stay connected with the latest smartwatch featuring health monitoring and premium design.",
            price: "$299.99",
            originalPrice: "$374.99",
            image: "/SmartWatch.png",
        },
        {
            id: 2,
            title: "Wireless Headphones Pro",
            description:
                "Experience crystal-clear audio with noise cancellation technology.",
            price: "$199.99",
            originalPrice: "$249.99",
            image: "/HeadSet.png",
        },

    ];

    useEffect(() => {
        if (isAutoPlay) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
            }, 5000);
        }
        return () => clearInterval(autoPlayRef.current);
    }, [isAutoPlay, heroSlides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    const goToSlide = (index) => setCurrentSlide(index);

    return (
        <section id="home" className="flex justify-center items-center">
            <div className="w-full max-w-4xl h-[420px] sm:h-[450px] lg:h-[480px] mx-auto">
                <div className="relative bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200 rounded-2xl overflow-hidden shadow-xl border border-blue-300 h-full">
                    <div className="relative h-full">
                        <div
                            className="flex transition-transform duration-700 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {heroSlides.map((slide) => {
                                const discountPercent = calculateDiscount(
                                    slide.price,
                                    slide.originalPrice
                                );

                                return (
                                    <div
                                        key={slide.id}
                                        className="w-full flex-shrink-0 h-full p-8 md:p-12 grid md:grid-cols-2 items-center"
                                    >
                                        <div className="space-y-4 text-center md:text-left">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-300/40 border border-blue-400/50 backdrop-blur-sm">
                                                <span className="text-xs font-semibold text-blue-900 uppercase tracking-widest">
                                                    Hot Deal
                                                </span>
                                            </div>

                                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-blue-900">
                                                {slide.title}
                                            </h1>

                                            <p className="text-blue-800 leading-relaxed max-w-md mx-auto md:mx-0 text-sm sm:text-base">
                                                {slide.description}
                                            </p>

                                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                                <span className="text-2xl sm:text-3xl font-bold text-blue-800">
                                                    {slide.price}
                                                </span>
                                                <span className="text-base sm:text-lg text-blue-400 line-through">
                                                    {slide.originalPrice}
                                                </span>

                                                {/* DYNAMIC DISCOUNT BADGE */}
                                                <span className="px-3 py-1 bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md">
                                                    Save {discountPercent}%
                                                </span>
                                            </div>

                                            <button className="mt-2 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300">
                                                Shop Now
                                            </button>
                                        </div>

                                        <div className="flex justify-center relative">
                                            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-300/50 to-blue-200/50 blur-2xl rounded-full"></div>

                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 z-30"
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 z-30"
                            aria-label="Next slide"
                        >
                            <FaChevronRight className="h-5 w-5" />
                        </button>

                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide
                                            ? "bg-blue-700 w-6 shadow-md"
                                            : "bg-blue-400 hover:bg-blue-500"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SliderSection;
