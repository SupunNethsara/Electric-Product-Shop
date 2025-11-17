import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

function FillterSidebar({
                            isFilterOpen = false,
                            selectedCategories = [],
                            priceRange = [0, 300000],
                            availability = "all",
                            categories = [],
                            toggleCategory = () => {},
                            setPriceRange = () => {},
                            setAvailability = () => {},
                            clearAllFilters = () => {},
                        }) {
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Group categories by level and parent
    const categoryTree = categories.reduce((acc, category) => {
        if (category.level === 0) {
            if (!acc[category.id]) {
                acc[category.id] = { ...category, children: [] };
            }
        } else if (category.level === 1) {
            const parent = Object.values(acc).find(cat => cat.name === category.parent);
            if (parent) {
                if (!parent.children.find(c => c.id === category.id)) {
                    parent.children.push({ ...category, children: [] });
                }
            }
        } else if (category.level === 2) {
            Object.values(acc).forEach(parent => {
                const child = parent.children.find(c => c.name === category.parent);
                if (child) {
                    if (!child.children.find(c => c.id === category.id)) {
                        child.children.push(category);
                    }
                }
            });
        }
        return acc;
    }, {});

    const renderCategoryTree = (categoryList, level = 0) => {
        return categoryList.map(category => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategories[category.id];
            const isSelected = selectedCategories.includes(category.id);

            return (
                <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
                    <div className="flex items-center justify-between group py-1">
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className={`flex-1 text-left px-2 py-1.5 rounded transition-all duration-200 ${
                                isSelected
                                    ? 'bg-green-100 text-green-800'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            <span className={`text-sm ${
                                level === 0 ? 'font-semibold' : level === 1 ? 'font-medium' : ''
                            } ${isSelected ? 'text-green-800' : 'group-hover:text-gray-900'}`}>
                                {category.name}
                            </span>
                        </button>

                        {hasChildren && (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 flex items-center justify-center w-6 h-6 ml-1"
                            >
                                {isExpanded ? (
                                    <Minus size={14} className="text-gray-500" />
                                ) : (
                                    <Plus size={14} className="text-gray-500" />
                                )}
                            </button>
                        )}
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="mt-1">
                            {renderCategoryTree(category.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div
            className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? "block" : "hidden lg:block"}`}
        >
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Filters</h2>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        Clear All
                    </button>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Price Range
                    </h3>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="0"
                            max="300000"
                            step="1000"
                            value={priceRange[0]}
                            onChange={(e) =>
                                setPriceRange([
                                    parseInt(e.target.value),
                                    priceRange[1],
                                ])
                            }
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />

                        <input
                            type="range"
                            min="0"
                            max="300000"
                            step="1000"
                            value={priceRange[1]}
                            onChange={(e) =>
                                setPriceRange([
                                    priceRange[0],
                                    parseInt(e.target.value),
                                ])
                            }
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />

                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Rs. {priceRange[0].toLocaleString()}</span>
                            <span>Rs. {priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Categories
                    </h3>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                        {categories.length > 0 ? (
                            renderCategoryTree(Object.values(categoryTree))
                        ) : (
                            <p className="text-sm text-gray-500">No categories available</p>
                        )}
                    </div>
                </div>

                <div className="mb-2">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Availability
                    </h3>
                    <div className="space-y-2">
                        {[
                            { value: "all", label: "All Products" },
                            { value: "in-stock", label: "In Stock" },
                            { value: "out-of-stock", label: "Out of Stock" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setAvailability(option.value)}
                                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-all duration-200 ${
                                    availability === option.value
                                        ? 'bg-green-100 text-green-800 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FillterSidebar;
