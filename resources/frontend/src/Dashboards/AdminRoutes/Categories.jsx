import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryModal from "./Common/CategoryModal.jsx";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://127.0.0.1:8000/api/categories");
            const categoriesData = Array.isArray(response.data)
                ? response.data
                : response.data.data;
            setCategories(categoriesData || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setMessage("Error loading categories. Please check your API endpoint.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleCategoryStatus = async (categoryId) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/categories/${categoryId}/toggle`);

            if (response.data && response.data.success) {
                setCategories(prev =>
                    prev.map(cat =>
                        cat.id === categoryId ? response.data.data : cat
                    )
                );
                setMessage("Category status updated successfully!");
            } else {
                setMessage("Unexpected response from server");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            setMessage("Error updating category status");
            fetchCategories();
        }
    };

    const clearMessage = () => setMessage("");

    const handleCategoryCreated = () => {
        setMessage("Category created successfully!");
        fetchCategories();
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your product categories
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#00ad42] text-white px-4 py-2 rounded-md hover:bg-green-600
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        transition-colors duration-200 text-sm font-medium"
                    >
                        + Create Category
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="text-xl font-semibold text-gray-900">
                            {categories.length}
                        </div>
                        <div className="text-gray-600 text-xs">Total Categories</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="text-xl font-semibold text-green-600">
                            {categories.filter(cat => cat.status === 'active').length}
                        </div>
                        <div className="text-gray-600 text-xs">Active</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="text-xl font-semibold text-gray-600">
                            {categories.filter(cat => cat.status === 'disabled').length}
                        </div>
                        <div className="text-gray-600 text-xs">Inactive</div>
                    </div>
                </div>

                {message && (
                    <div
                        className={`mb-6 p-3 rounded-lg flex items-center justify-between ${
                            message.includes("Error")
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                    >
                        <span className="text-sm">{message}</span>
                        <button
                            onClick={clearMessage}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                                Categories List
                            </h2>
                            <button
                                onClick={fetchCategories}
                                disabled={loading}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-500 text-sm mt-3">
                                    Loading categories...
                                </p>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 font-medium mb-1">
                                    No categories found
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Get started by creating your first category
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#00ad42] text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-medium"
                                >
                                    Create Category
                                </button>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {category.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(
                                                    category.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={category.status === 'active'}
                                                    onChange={() => toggleCategoryStatus(category.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400
                                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                                        peer-checked:after:translate-x-full peer-checked:bg-green-500"></div>
                                                <span className="ml-2 text-sm text-gray-700">
                                                    {category.status === 'active' ? "Active" : "Inactive"}
                                                </span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCategoryCreated={handleCategoryCreated}
                />
            </div>
        </div>
    );
}

export default Categories;
