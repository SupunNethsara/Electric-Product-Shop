import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useRef } from 'react';
function HomeBannerControl() {
    const [slides, setSlides] = useState([]);
    const [editingSlide, setEditingSlide] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        const initialSlides = [
            {
                id: 1,
                title: "Smart Watch Series",
                description: "Stay connected with the latest smartwatch featuring health monitoring and premium design.",
                price: "$299.99",
                originalPrice: "$374.99",
                image: "/GreenSmartWatch.png",
                isActive: true,
                order: 1
            },
            {
                id: 2,
                title: "Wireless Headphones",
                description: "Experience crystal-clear audio with noise cancellation technology.",
                price: "$199.99",
                originalPrice: "$249.99",
                image: "/GreenHeadSet.png",
                isActive: true,
                order: 2
            }
        ];
        setSlides(initialSlides);
    }, []);

    const handleAddSlide = () => {
        const newSlide = {
            id: Date.now(),
            title: "New Product",
            description: "Product description here...",
            price: "$99.99",
            originalPrice: "$129.99",
            image: "/default-image.png",
            isActive: true,
            order: slides.length + 1
        };
        setSlides([...slides, newSlide]);
        setEditingSlide(newSlide);
        setIsAddingNew(true);
    };

    const handleEditSlide = (slide) => {
        setEditingSlide(slide);
        setIsAddingNew(false);
    };

    const handleSaveSlide = (updatedSlide) => {
        if (isAddingNew) {
            setSlides(slides.map(slide =>
                slide.id === updatedSlide.id ? updatedSlide : slide
            ));
        } else {
            setSlides(slides.map(slide =>
                slide.id === updatedSlide.id ? updatedSlide : slide
            ));
        }
        setEditingSlide(null);
        setIsAddingNew(false);
    };

    const handleDeleteSlide = (slideId) => {
        setSlides(slides.filter(slide => slide.id !== slideId));
    };

    const handleReorder = (fromIndex, toIndex) => {
        const updatedSlides = [...slides];
        const [movedSlide] = updatedSlides.splice(fromIndex, 1);
        updatedSlides.splice(toIndex, 0, movedSlide);

        const reorderedSlides = updatedSlides.map((slide, index) => ({
            ...slide,
            order: index + 1
        }));

        setSlides(reorderedSlides);
    };

    const toggleSlideActive = (slideId) => {
        setSlides(slides.map(slide =>
            slide.id === slideId ? { ...slide, isActive: !slide.isActive } : slide
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Home Banner Slides</h2>
                <button
                    onClick={handleAddSlide}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Add New Slide
                </button>
            </div>

            {editingSlide ? (
                <SlideEditor
                    slide={editingSlide}
                    onSave={handleSaveSlide}
                    onCancel={() => {
                        setEditingSlide(null);
                        setIsAddingNew(false);
                    }}
                    isNew={isAddingNew}
                />
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Preview
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {slides.sort((a, b) => a.order - b.order).map((slide, index) => (
                                <tr key={slide.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => index > 0 && handleReorder(index, index - 1)}
                                                disabled={index === 0}
                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                ↑
                                            </button>
                                            <span className="text-sm text-gray-900">{slide.order}</span>
                                            <button
                                                onClick={() => index < slides.length - 1 && handleReorder(index, index + 1)}
                                                disabled={index === slides.length - 1}
                                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                ↓
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {slide.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleSlideActive(slide.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                slide.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {slide.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEditSlide(slide)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSlide(slide.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                        <div className=" rounded-lg p-4">
                            <SliderSectionPreview slides={slides.filter(slide => slide.isActive)} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function SlideEditor({ slide, onSave, onCancel, isNew }) {
    const [formData, setFormData] = useState(slide);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isNew ? 'Add New Slide' : 'Edit Slide'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => handleChange('image', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price
                        </label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Original Price
                        </label>
                        <input
                            type="text"
                            value={formData.originalPrice}
                            onChange={(e) => handleChange('originalPrice', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {isNew ? 'Add Slide' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function SliderSectionPreview({ slides }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRefs = useRef([]);

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

    if (slides.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No active slides to display
            </div>
        );
    }

    return (
        <section className="flex justify-center items-center">
            <div className="max-w-7xl h-[500px] sm:h-[450px] lg:h-[500px] mx-auto w-full">
                <div className="relative bg-gradient-to-br from-green-200 via-green-100 to-green-200 rounded-3xl overflow-hidden shadow-xl h-full">
                    <div className="relative h-full">
                        <div className="h-full">
                            {slides.map((slide, index) => {
                                const discountPercent = calculateDiscount(
                                    slide.price,
                                    slide.originalPrice
                                );

                                return (
                                    <div
                                        key={slide.id}
                                        ref={(el) => (slideRefs.current[index] = el)}
                                        className={`absolute inset-0 transition-opacity duration-500 ${
                                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <div className="w-full h-full p-5 sm:p-16 grid md:grid-cols-2 items-center">
                                            <div className="text-content space-y-3 sm:space-y-4 text-center md:text-left">
                                                <div className="inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm">
                                                    <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>
                                                        NEWS
                                                    </span>
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
                                    </div>
                                );
                            })}
                        </div>

                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-slate-700 rounded-full p-3 shadow-lg hover:bg-slate-800 hover:text-white transition-all duration-300 z-30 backdrop-blur-sm"
                                    aria-label="Previous slide"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-slate-700 rounded-full p-3 shadow-lg hover:bg-slate-800 hover:text-white transition-all duration-300 z-30 backdrop-blur-sm"
                                    aria-label="Next slide"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {slides.length > 1 && (
                            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                                {slides.map((_, index) => (
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
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeBannerControl;
