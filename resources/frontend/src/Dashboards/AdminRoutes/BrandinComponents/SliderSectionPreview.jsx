import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useRef } from 'react';

function SliderSectionPreview({ slides }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRefs = useRef([]);
    const containerRef = useRef(null);

    const calculateDiscount = (price, originalPrice) => {
        const p = parseFloat(price.replace('$', ''));
        const op = parseFloat(originalPrice.replace('$', ''));
        if (op <= p) return 0;
        const discount = ((op - p) / op) * 100;
        return Math.round(discount);
    };

    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % slides.length;
        animateSlideChange(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        animateSlideChange(prevIndex);
    };

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        animateSlideChange(index);
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

            setCurrentSlide(newIndex);

            gsap.fromTo(nextSlideEl.querySelector('.text-content'),
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.2
                }
            );

            gsap.fromTo(nextSlideEl.querySelector('.image-content'),
                { scale: 0.9, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.4
                }
            );
        }
    };

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [currentSlide, slides.length]);

    const getColorClass = (colorClass, defaultClass = '') => {
        if (!colorClass) return defaultClass;
        return colorClass.replace(/["']/g, '').trim();
    };

    if (slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-100 rounded-lg">
                <div className="text-center">
                    <div className="text-lg font-medium mb-2">No active slides to display</div>
                    <div className="text-sm text-gray-400">Add and activate slides to see preview</div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-6xl mx-auto aspect-[16/9] min-h-[400px] max-h-[600px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg"
        >
            {slides.map((slide, index) => {
                const discountPercent = calculateDiscount(slide.price, slide.original_price);
                const isActive = index === currentSlide;

                return (
                    <div
                        key={slide.id}
                        ref={(el) => (slideRefs.current[index] = el)}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div
                            className="relative w-full h-full"
                            style={{
                                background: slide.gradient_from && slide.gradient_via && slide.gradient_to
                                    ? `linear-gradient(135deg, ${slide.gradient_from}, ${slide.gradient_via}, ${slide.gradient_to})`
                                    : `linear-gradient(135deg, #dcfce7, #f0fdf4, #dcfce7)` // Default fallback
                            }}
                        >
                            <div className="relative w-full h-full p-4 sm:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 items-center">
                                {/* Text Content */}
                                <div className={`text-content space-y-3 sm:space-y-4 text-center md:text-left z-10 ${getColorClass(slide.text_color, 'text-slate-800')}`}>
                                    {/* Dynamic badge */}
                                    <div className="inline-flex items-center gap-2 bg-green-300 text-green-600 pr-3 p-1 rounded-full text-xs">
                                        <span className={`${getColorClass(slide.badge_color, 'bg-green-600')} px-2 py-1 rounded-full text-white text-xs font-medium`}>
                                            {slide.badge_text || 'NEWS'}
                                        </span>
                                        <span className="pr-1">{slide.promotion_text || 'Free Shipping on Orders Above $50!'}</span>
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent leading-tight">
                                        {slide.title}
                                    </h1>

                                    <p className="leading-relaxed text-sm sm:text-base max-w-md mx-auto md:mx-0 opacity-90">
                                        {slide.description}
                                    </p>

                                    <div className="font-medium">
                                        <p className="text-sm opacity-90">Starts from</p>
                                        <div className="flex items-center gap-3 flex-wrap mt-1">
                                            <span className="text-xl sm:text-2xl font-bold">
                                                {slide.price}
                                            </span>
                                            <span className="text-lg opacity-60 line-through">
                                                {slide.original_price}
                                            </span>
                                            {discountPercent > 0 && (
                                                <span className="px-2 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                                                    Save {discountPercent}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className={`${getColorClass(slide.button_color, 'bg-slate-800')} ${getColorClass(slide.button_text_color, 'text-white')} py-2 px-6 sm:py-3 sm:px-8 mt-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base`}
                                    >
                                        {slide.call_to_action || 'SHOP NOW'}
                                    </button>
                                </div>

                                <div className="image-content flex justify-center items-center relative mt-6 md:mt-0">
                                    <div
                                        className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 blur-2xl rounded-full"
                                        style={{
                                            background: slide.gradient_from && slide.gradient_to
                                                ? `linear-gradient(135deg, ${slide.gradient_from}40, ${slide.gradient_to}40)`
                                                : 'linear-gradient(135deg, #86efac40, #4ade8040)'
                                        }}
                                    ></div>
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30 backdrop-blur-sm border border-gray-200"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30 backdrop-blur-sm border border-gray-200"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </>
            )}

            {slides.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? "bg-slate-800 w-6 sm:w-8 h-2 sm:h-2 shadow-lg"
                                    : "bg-slate-300 hover:bg-slate-400 w-2 h-2"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SliderSectionPreview;
