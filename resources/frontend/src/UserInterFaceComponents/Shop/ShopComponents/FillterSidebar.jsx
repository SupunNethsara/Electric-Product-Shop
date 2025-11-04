import React from "react";

function FillterSidebar({
                            isFilterOpen = false,
                            selectedCategories = [],
                            selectedBrands = [],
                            priceRange = [0, 1000],
                            availability = "all",
                            categories = [],
                            brands = [],
                            toggleCategory = () => {},
                            toggleBrand = () => {},
                            setPriceRange = () => {},
                            setAvailability = () => {},
                            clearAllFilters = () => {},
                        }) {

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
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                        {category.name}
                                    </span>
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No categories available</p>
                        )}
                    </div>
                </div>
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">
                        Brands
                    </h3>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <label
                                key={brand}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                    {brand}
                                </span>
                            </label>
                        ))}
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
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name="availability"
                                    value={option.value}
                                    checked={availability === option.value}
                                    onChange={(e) =>
                                        setAvailability(e.target.value)
                                    }
                                    className="text-green-600 focus:ring-green-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FillterSidebar;
