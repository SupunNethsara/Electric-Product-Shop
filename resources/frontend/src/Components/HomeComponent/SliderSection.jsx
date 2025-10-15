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

    // const prevSlide = () => {
    //     const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    //     animateSlideChange(prevIndex);
    // };

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
        <section id="home" className="flex justify-center items-center px-0">
            <div className="w-full max-w-4xl h-[500px] sm:h-[450px] lg:h-[500px] mx-auto">
                <div className="relative bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200 rounded-2xl overflow-hidden shadow-xl h-full">
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
                                        className="w-full flex-shrink-0 h-full p-8 md:p-12 grid md:grid-cols-2 items-center"
                                    >
                                        <div className="text-content space-y-4 text-center md:text-left">
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

                                                <span className="px-3 py-1 bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md">
                                                    Save {discountPercent}%
                                                </span>
                                            </div>

                                            <button className="mt-2 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                                                Shop Now
                                            </button>
                                        </div>
                                        <div className="image-content flex justify-center relative">
                                            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-300/50 to-blue-200/50 blur-2xl rounded-full"></div>

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
                        {/*    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-blue-700 rounded-full p-3 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 z-30 backdrop-blur-sm"*/}
                        {/*    aria-label="Previous slide"*/}
                        {/*>*/}
                        {/*    <FaChevronLeft className="h-5 w-5" />*/}
                        {/*</button>*/}
                        {/*<button*/}
                        {/*    onClick={nextSlide}*/}
                        {/*    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-blue-700 rounded-full p-3 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 z-30 backdrop-blur-sm"*/}
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
                                            ? "bg-blue-700 w-8 shadow-lg"
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
