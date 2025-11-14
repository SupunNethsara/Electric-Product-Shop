import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryModal from "./Common/CategoryModal.jsx";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedParent, setSelectedParent] = useState(null);

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
                // Update the category in the state
                const updateCategoryInTree = (cats) => {
                    return cats.map(cat => {
                        if (cat.id === categoryId) {
                            return response.data.data;
                        }
                        if (cat.children && cat.children.length > 0) {
                            return {
                                ...cat,
                                children: updateCategoryInTree(cat.children)
                            };
                        }
                        return cat;
                    });
                };

                setCategories(prev => updateCategoryInTree(prev));
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
        setSelectedParent(null);
    };

    const handleAddSubcategory = (parentCategory) => {
        setSelectedParent(parentCategory);
        setIsModalOpen(true);
    };

    // Recursive function to render categories tree
    const renderCategoryTree = (categories, level = 0) => {
        return categories.map((category) => (
            <React.Fragment key={category.id}>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div
                            className="text-sm font-medium text-gray-900"
                            style={{ paddingLeft: `${level * 20}px` }}
                        >
                            {level > 0 && (
                                <span className="text-gray-400 mr-2">↳</span>
                            )}
                            {category.name}
                            {category.level < 2 && (
                                <button
                                    onClick={() => handleAddSubcategory(category)}
                                    className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                                >
                                    + Add Subcategory
                                </button>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                            {category.description || "No description"}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                            {new Date(category.created_at).toLocaleDateString()}
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
                {category.children && category.children.length > 0 && (
                    renderCategoryTree(category.children, level + 1)
                )}
            </React.Fragment>
        ));
    };

    // Count total categories including children
    const countAllCategories = (cats) => {
        let count = 0;
        cats.forEach(cat => {
            count++;
            if (cat.children) {
                count += countAllCategories(cat.children);
            }
        });
        return count;
    };

    const countActiveCategories = (cats) => {
        let count = 0;
        cats.forEach(cat => {
            if (cat.status === 'active') count++;
            if (cat.children) {
                count += countActiveCategories(cat.children);
            }
        });
        return count;
    };

    const totalCategories = countAllCategories(categories);
    const activeCategories = countActiveCategories(categories);
    const inactiveCategories = totalCategories - activeCategories;

    return (
        <div className="min-h-full p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your product categories and subcategories
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedParent(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-[#00ad42] text-white px-4 py-2 rounded-md hover:bg-green-600
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    transition-colors duration-200 text-sm font-medium"
                >
                    + Create Category
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="text-xl font-semibold text-gray-900">
                        {totalCategories}
                    </div>
                    <div className="text-gray-600 text-xs">Total Categories</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="text-xl font-semibold text-green-600">
                        {activeCategories}
                    </div>
                    <div className="text-gray-600 text-xs">Active</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="text-xl font-semibold text-gray-600">
                        {inactiveCategories}
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
                            Categories Hierarchy
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

                <div>
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
                        <div className="overflow-x-auto">
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
                                {renderCategoryTree(categories)}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedParent(null);
                }}
                onCategoryCreated={handleCategoryCreated}
                parentCategory={selectedParent}
            />
        </div>
    );
}

export default Categories;
