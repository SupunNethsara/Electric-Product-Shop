'use client'
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { gsap } from "gsap";

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
    const slideContainerRef = useRef(null);
    const slideRefs = useRef([]);

    const heroSlides = [
        {
            id: 1,
            title: "Smart Watch Series",
            description: "Stay connected with the latest smartwatch featuring health monitoring and premium design.",
            price: "$299.99",
            originalPrice: "$374.99",
            image: "/GreenSmartWatch.png",
        },
        {
            id: 2,
            title: "Wireless Headphones",
            description: "Experience crystal-clear audio with noise cancellation technology.",
            price: "$199.99",
            originalPrice: "$249.99",
            image: "/GreenHeadSet.png",
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
                gsap.fromTo(nextSlideEl.querySelectorAll('.text-content > *'),
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                        delay: 0.3
                    }
                );

                gsap.fromTo(nextSlideEl.querySelector('.image-content img'),
                    { scale: 0.9, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        delay: 0.4
                    }
                );

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
        <section className="flex justify-center items-center ">
            <div className=" max-w-7xl h-[500px] sm:h-[450px] lg:h-[500px] mx-auto">
                <div className="relative bg-gradient-to-br from-green-200 via-green-100 to-green-200 rounded-3xl overflow-hidden shadow-xl h-full">
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
                                        className="w-full flex-shrink-0 h-full p-5 sm:p-16 grid md:grid-cols-2 items-center"
                                    >
                                        <div className="text-content space-y-3 sm:space-y-4 text-center md:text-left">
                                            <div className="inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm">
                                                <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span>
                                                Free Shipping on Orders Above $50!

                                            </div>

                                            <h1 className="text-3xl sm:text-4xl leading-[1.2] font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs sm:max-w-md">
                                                {slide.title}
                                            </h1>

                                            <p className="text-slate-600 leading-relaxed max-w-md mx-auto md:mx-0 text-sm sm:text-sm">
                                                {slide.description}
                                            </p>

                                            <div className="text-slate-800 text-sm font-medium mt-1 sm:mt-3">
                                                <p>Starts from</p>
                                                <div className="flex items-center gap-3 flex-wrap mt-1">
                                                    <span className="text-xl sm:text-2xl font-bold text-slate-800">
                                                        {slide.price}
                                                    </span>
                                                    <span className="text-base sm:text-lg text-slate-400 line-through">
                                                        {slide.originalPrice}
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                                                        Save {discountPercent}%
                                                    </span>
                                                </div>
                                            </div>

                                            <button className="bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-3 sm:px-8 mt-4 rounded-md hover:bg-slate-900 hover:scale-105 active:scale-95 transition">
                                                SHOP NOW
                                            </button>
                                        </div>
                                        <div className="image-content flex justify-center relative">
                                            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-green-300/50 to-green-200/50 blur-2xl rounded-full"></div>
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/*<button*/}
                        {/*    onClick={prevSlide}*/}
                        {/*    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-slate-700 rounded-full p-3 shadow-lg hover:bg-slate-800 hover:text-white transition-all duration-300 z-30 backdrop-blur-sm"*/}
                        {/*    aria-label="Previous slide"*/}
                        {/*>*/}
                        {/*    <FaChevronLeft className="h-5 w-5" />*/}
                        {/*</button>*/}
                        {/*<button*/}
                        {/*    onClick={nextSlide}*/}
                        {/*    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-slate-700 rounded-full p-3 shadow-lg hover:bg-slate-800 hover:text-white transition-all duration-300 z-30 backdrop-blur-sm"*/}
                        {/*    aria-label="Next slide"*/}
                        {/*>*/}
                        {/*    <FaChevronRight className="h-5 w-5" />*/}
                        {/*</button>*/}

                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide
                                            ? "bg-slate-800 w-8 shadow-lg"
                                            : "bg-slate-400 hover:bg-slate-500"
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
