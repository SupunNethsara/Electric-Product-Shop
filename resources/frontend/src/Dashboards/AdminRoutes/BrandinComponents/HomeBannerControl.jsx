import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import axios from 'axios';
import SliderSectionPreview from "./SliderSectionPreview.jsx";

const API_BASE_URL = 'http://localhost:8000/api';

// Main Component
function HomeBannerControl() {
    const [slides, setSlides] = useState([]);
    const [editingSlide, setEditingSlide] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/slides`);
            setSlides(response.data);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSlide = () => {
        const newSlide = {
            title: "New Product",
            description: "Product description here...",
            price: "$99.99",
            original_price: "$129.99",
            image: "/default-image.png",
            background_gradient: "from-green-200 via-green-100 to-green-200",
            gradient_from: "#dcfce7",
            gradient_via: "#f0fdf4",
            gradient_to: "#dcfce7",
            text_color: "text-slate-800",
            button_color: "bg-slate-800",
            button_text_color: "text-white",
            badge_text: "NEWS",
            badge_color: "bg-green-600",
            promotion_text: "Free Shipping on Orders Above $50!",
            call_to_action: "SHOP NOW",
            is_active: true,
            order: slides.length + 1
        };
        setEditingSlide(newSlide);
        setIsAddingNew(true);
    };

    const handleEditSlide = (slide) => {
        setEditingSlide(slide);
        setIsAddingNew(false);
    };

    const handleSaveSlide = async (updatedSlide) => {
        try {
            setIsLoading(true);
            if (isAddingNew) {
                const response = await axios.post(`${API_BASE_URL}/slides`, updatedSlide);
                setSlides(prev => [...prev, response.data]);
            } else {
                const response = await axios.put(`${API_BASE_URL}/slides/${updatedSlide.id}`, updatedSlide);
                setSlides(prev => prev.map(slide =>
                    slide.id === updatedSlide.id ? response.data : slide
                ));
            }
            setEditingSlide(null);
            setIsAddingNew(false);
        } catch (error) {
            console.error('Error saving slide:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSlide = async (slideId) => {
        try {
            await axios.delete(`${API_BASE_URL}/slides/${slideId}`);
            setSlides(prev => prev.filter(slide => slide.id !== slideId));
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };

    const handleReorder = async (fromIndex, toIndex) => {
        const updatedSlides = [...slides];
        const [movedSlide] = updatedSlides.splice(fromIndex, 1);
        updatedSlides.splice(toIndex, 0, movedSlide);

        const reorderedSlides = updatedSlides.map((slide, index) => ({
            ...slide,
            order: index + 1
        }));

        setSlides(reorderedSlides);

        // Update order in backend
        try {
            await axios.put(`${API_BASE_URL}/slides/order/update`, {
                slides: reorderedSlides.map(slide => ({
                    id: slide.id,
                    order: slide.order
                }))
            });
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const toggleSlideActive = async (slideId) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/slides/${slideId}/toggle-status`);
            setSlides(prev => prev.map(slide =>
                slide.id === slideId ? response.data : slide
            ));
        } catch (error) {
            console.error('Error toggling slide status:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

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
                                                slide.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {slide.is_active ? 'Active' : 'Inactive'}
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
                        <div className="rounded-lg">
                            <SliderSectionPreview slides={slides.filter(slide => slide.is_active)} />
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

    const colorPresets = {
        gradients: [
            { value: 'from-green-200 via-green-100 to-green-200', label: 'Green Gradient' },
            { value: 'from-blue-200 via-blue-100 to-blue-200', label: 'Blue Gradient' },
            { value: 'from-purple-200 via-purple-100 to-purple-200', label: 'Purple Gradient' },
            { value: 'from-orange-200 via-orange-100 to-orange-200', label: 'Orange Gradient' },
            { value: 'from-pink-200 via-pink-100 to-pink-200', label: 'Pink Gradient' }
        ],
        badgeColors: [
            { value: 'bg-green-600', label: 'Green' },
            { value: 'bg-blue-600', label: 'Blue' },
            { value: 'bg-red-600', label: 'Red' },
            { value: 'bg-purple-600', label: 'Purple' },
            { value: 'bg-yellow-600', label: 'Yellow' }
        ],
        buttonColors: [
            { value: 'bg-slate-800', label: 'Dark Gray' },
            { value: 'bg-blue-600', label: 'Blue' },
            { value: 'bg-green-600', label: 'Green' },
            { value: 'bg-red-600', label: 'Red' },
            { value: 'bg-purple-600', label: 'Purple' }
        ]
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isNew ? 'Add New Slide' : 'Edit Slide'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                            value={formData.original_price}
                            onChange={(e) => handleChange('original_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Background Customization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background Gradient
                            </label>
                            <select
                                value={formData.background_gradient}
                                onChange={(e) => handleChange('background_gradient', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {colorPresets.gradients.map(gradient => (
                                    <option key={gradient.value} value={gradient.value}>
                                        {gradient.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Gradient From (Hex)
                            </label>
                            <input
                                type="color"
                                value={formData.gradient_from}
                                onChange={(e) => handleChange('gradient_from', e.target.value)}
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Gradient Via (Hex)
                            </label>
                            <input
                                type="color"
                                value={formData.gradient_via}
                                onChange={(e) => handleChange('gradient_via', e.target.value)}
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Gradient To (Hex)
                            </label>
                            <input
                                type="color"
                                value={formData.gradient_to}
                                onChange={(e) => handleChange('gradient_to', e.target.value)}
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Content Customization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Badge Text
                            </label>
                            <input
                                type="text"
                                value={formData.badge_text}
                                onChange={(e) => handleChange('badge_text', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Badge Color
                            </label>
                            <select
                                value={formData.badge_color}
                                onChange={(e) => handleChange('badge_color', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {colorPresets.badgeColors.map(color => (
                                    <option key={color.value} value={color.value}>
                                        {color.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Promotion Text
                            </label>
                            <input
                                type="text"
                                value={formData.promotion_text}
                                onChange={(e) => handleChange('promotion_text', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Text
                            </label>
                            <input
                                type="text"
                                value={formData.call_to_action}
                                onChange={(e) => handleChange('call_to_action', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Color
                            </label>
                            <select
                                value={formData.button_color}
                                onChange={(e) => handleChange('button_color', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {colorPresets.buttonColors.map(color => (
                                    <option key={color.value} value={color.value}>
                                        {color.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
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

<SliderSectionPreview/>

export default HomeBannerControl;
