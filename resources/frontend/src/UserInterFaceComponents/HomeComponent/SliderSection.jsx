'use client'
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { gsap } from "gsap";

const calculateDiscount = (price, originalPrice) => {
    const p = parseFloat(price.replace('Rs', ''));
    const op = parseFloat(originalPrice.replace('Rs', ''));

    if (op <= p) return 0;

    const discount = ((op - p) / op) * 100;
    return Math.round(discount);
};

function SliderSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const isAutoPlay = true;
    const autoPlayRef = useRef(null);
    const slideContainerRef = useRef(null);
    const slideRefs = useRef([]);

    const themeColors = {
        primary: '#0866ff',
        primaryHover: '#0759e0',
        secondary: '#e3251b',
        secondaryHover: '#c91f16',
        gradientFrom: '#e6f0ff',
        gradientVia: '#f0f7ff',
        gradientTo: '#e6f0ff',
    };

    const heroSlides = [
        {
            id: 1,
            title: "CCTV Systems",
            description: "Advanced security solutions for your home and business.",
            price: "Rs299.99",
            originalPrice: "Rs374.99",
            image: "/CCTV.png",
        },
        {
            id: 2,
            title: "DSLR Cameras",
            description: "Professional photography equipment for stunning results.",
            price: "Rs899.99",
            originalPrice: "Rs1,199.99",
            image: "/CameraBlack.png",
        },
        {
            id: 3,
            title: "Power Supplies",
            description: "Reliable power solutions for all your devices.",
            price: "Rs129.99",
            originalPrice: "Rs159.99",
            image: "/powersuply.png",
        },
    ];

    const addToSlideRefs = (el, index) => {
        if (el) {
            slideRefs.current[index] = el;
        }
    };

    const animateSlideChange = (newIndex) => {
        const currentSlideEl = slideRefs.current[currentSlide];
        const nextSlideEl = slideRefs.current[newIndex];

        if (currentSlideEl && nextSlideEl) {
            gsap.to(currentSlideEl.querySelectorAll('.text-content, .image-content'), {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: "power2.inOut"
            });

            gsap.set(nextSlideEl.querySelectorAll('.text-content, .image-content'), {
                opacity: 0,
                y: 20
            });

            setTimeout(() => {
                setCurrentSlide(newIndex);

                gsap.to(nextSlideEl.querySelector('.text-content'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });

                gsap.to(nextSlideEl.querySelector('.image-content'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.2
                });

            }, 400);
        }
    };

    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % heroSlides.length;
        animateSlideChange(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        animateSlideChange(prevIndex);
    };

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        animateSlideChange(index);
    };

    useEffect(() => {
        const firstSlide = slideRefs.current[0];
        if (firstSlide) {
            gsap.set(firstSlide.querySelectorAll('.text-content, .image-content'), {
                opacity: 1,
                y: 0
            });
        }
    }, []);

    useEffect(() => {
        if (isAutoPlay) {
            autoPlayRef.current = setInterval(() => {
                nextSlide();
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlay, currentSlide]);

    return (
        <section className="flex justify-center items-center">
            <div className="w-full h-[400px] sm:h-[450px] lg:h-[500px]">
                <div
                    className="relative rounded-3xl overflow-hidden shadow-xl h-full"
                    style={{
                        background: `linear-gradient(135deg, ${themeColors.gradientFrom}, ${themeColors.gradientVia}, ${themeColors.gradientTo})`
                    }}
                >
                    <div className="relative h-full">
                        <div
                            ref={slideContainerRef}
                            className="flex transition-transform duration-500 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {heroSlides.map((slide, index) => {
                                const discountPercent = calculateDiscount(
                                    slide.price,
                                    slide.originalPrice
                                );

                                return (
                                    <div
                                        key={slide.id}
                                        ref={(el) => addToSlideRefs(el, index)}
                                        className="w-full flex-shrink-0 h-full p-4 sm:p-8 lg:p-16 grid md:grid-cols-2 items-center"
                                    >
                                        {/* Text Content */}
                                        <div className="text-content space-y-3 sm:space-y-4 text-center md:text-left">
                                            <div
                                                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm"
                                                style={{
                                                    backgroundColor: `${themeColors.primary}15`,
                                                    color: themeColors.primary
                                                }}
                                            >
                                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                Free Shipping Over Rs50
                                            </div>

                                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                                                {slide.title}
                                            </h1>

                                            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
                                                {slide.description}
                                            </p>

                                            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
                                                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                                    {slide.price}
                                                </span>
                                                <span className="text-lg sm:text-xl text-gray-400 line-through">
                                                    {slide.originalPrice}
                                                </span>
                                                {discountPercent > 0 && (
                                                    <span
                                                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-semibold rounded-full"
                                                        style={{ backgroundColor: themeColors.secondary }}
                                                    >
                                                        Save {discountPercent}%
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                className="text-white text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 px-8 sm:px-12 mt-4 sm:mt-6 rounded-lg hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg"
                                                style={{
                                                    backgroundColor: themeColors.primary,
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = themeColors.primaryHover}
                                                onMouseOut={(e) => e.target.style.backgroundColor = themeColors.primary}
                                            >
                                                Shop Now
                                            </button>
                                        </div>

                                        {/* Image Content */}
                                        <div className="image-content flex justify-center relative mt-4 md:mt-0">
                                            <div
                                                className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 blur-2xl sm:blur-3xl rounded-full opacity-60"
                                                style={{
                                                    background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.primary}05)`
                                                }}
                                            ></div>
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                className="relative z-10 w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 xl:w-96 xl:h-96 object-contain transform hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={prevSlide}
                            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-600 rounded-full p-2 sm:p-3 lg:p-4 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 z-30 backdrop-blur-sm"
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-600 rounded-full p-2 sm:p-3 lg:p-4 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 z-30 backdrop-blur-sm"
                            aria-label="Next slide"
                        >
                            <FaChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </button>

                        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`rounded-full transition-all duration-300 ${
                                        index === currentSlide
                                            ? "shadow-lg"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                    style={{
                                        backgroundColor: index === currentSlide ? themeColors.primary : undefined,
                                        width: index === currentSlide ? '24px' : '10px',
                                        height: '10px',
                                    }}
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
