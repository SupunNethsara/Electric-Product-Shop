import React, { useState, useEffect } from "react";
import axios from "axios";

function CategoryModal({ isOpen, onClose, onCategoryCreated, parentCategory }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories');
                const categoriesData = Array.isArray(response.data)
                    ? response.data
                    : response.data.data;
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (parentCategory) {
            setFormData(prev => ({
                ...prev,
                parent_id: parentCategory.id
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                parent_id: null
            }));
        }
    }, [parentCategory]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                description: '',
                parent_id: null
            });
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/api/categories', formData);
            onCategoryCreated();
        } catch (error) {
            console.error('Error creating category:', error);
            if (error.response?.data?.errors?.name) {
                setError(error.response.data.errors.name[0]);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to create category. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setLoading(false);
        onClose();
    };

    const renderCategoryOptions = (categories, level = 0) => {
        return categories.map(category => (
            <React.Fragment key={category.id}>
                <option
                    value={category.id}
                    disabled={category.id === parentCategory?.id}
                >
                    {'\u00A0\u00A0'.repeat(level)} {/* Non-breaking spaces for indentation */}
                    {level > 0 ? '↳ ' : ''}
                    {category.name}
                </option>
                {category.children && renderCategoryOptions(category.children, level + 1)}
            </React.Fragment>
        ));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity"></div>

            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-6 pt-6 pb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                    {parentCategory ? 'Add Subcategory' : 'Create New Category'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {parentCategory && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-700">
                                        Adding subcategory to: <strong>{parentCategory.name}</strong>
                                    </p>
                                    {parentCategory.description && (
                                        <p className="text-sm text-blue-600 mt-1">
                                            {parentCategory.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-white px-6 py-4">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter category name"
                                        disabled={loading}
                                    />
                                </div>

                                {!parentCategory && (
                                    <div>
                                        <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Parent Category (Optional)
                                        </label>
                                        <select
                                            id="parent_id"
                                            name="parent_id"
                                            value={formData.parent_id || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={loading}
                                        >
                                            <option value="">No Parent (Main Category)</option>
                                            {renderCategoryOptions(categories)}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Leave empty to create a main category
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter category description (optional)"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.name.trim()}
                                className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Category'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;
