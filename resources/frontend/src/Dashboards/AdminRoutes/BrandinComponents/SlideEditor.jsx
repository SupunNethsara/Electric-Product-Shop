import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

function SlideEditor({ slide, onSave, onCancel, isNew }) {
    const [formData, setFormData] = useState(slide);
    const [imagePreview, setImagePreview] = useState(slide.image || '');
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsUploading(true);
        try {
            let response;

            if (isNew) {
                const submitData = new FormData();

                Object.keys(formData).forEach(key => {
                    if (key === 'image' && formData[key] instanceof File) {
                        submitData.append('image', formData[key]);
                    } else if (key !== 'image') {
                        submitData.append(key, formData[key]);
                    }
                });

                response = await axios.post(`${API_BASE_URL}/slides`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                if (formData.image instanceof File) {
                    const submitData = new FormData();

                    Object.keys(formData).forEach(key => {
                        if (key === 'image') {
                            submitData.append('image', formData[key]);
                        } else {
                            submitData.append(key, formData[key]);
                        }
                    });

                    submitData.append('_method', 'PUT');
                    response = await axios.post(`${API_BASE_URL}/slides/${formData.id}`, submitData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    response = await axios.put(`${API_BASE_URL}/slides/${formData.id}`, formData);
                }
            }

            onSave(response.data);
        } catch (error) {
            console.error('Error saving slide:', error);
            if (error.response?.data?.errors) {
                console.log('Validation errors:', error.response.data.errors);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setImagePreview(url);
        handleChange('image', url);
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

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slide Image
                        </label>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: JPEG, PNG, GIF, WebP. Max size: 2MB
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    value={typeof formData.image === 'string' ? formData.image : ''}
                                    onChange={handleImageUrlChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {imagePreview && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preview
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 mx-auto object-contain rounded"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
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
                        disabled={isUploading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isUploading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isNew ? 'Add Slide' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SlideEditor;
