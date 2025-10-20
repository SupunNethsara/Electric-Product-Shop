// CategorySelect.js
import React from 'react';

const CategorySelect = ({ categories, loading, selectedCategory, onCategoryChange }) => {
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-gray-600">Loading categories...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category *
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Choose a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        All products will be assigned to this category
                    </p>
                </div>

                {selectedCategory && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-blue-800 font-medium text-sm mb-1">
                            Selected Category:
                        </h4>
                        <p className="text-blue-700 font-semibold">
                            {categories.find(cat => cat.id === selectedCategory)?.name}
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                            {categories.find(cat => cat.id === selectedCategory)?.description}
                        </p>
                    </div>
                )}
            </div>

            {!selectedCategory && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-yellow-800 text-sm">
                            Please select a category to continue
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySelect;
