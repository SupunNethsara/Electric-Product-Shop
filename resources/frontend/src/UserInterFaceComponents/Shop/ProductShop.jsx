import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from "../Products/ProductCard.jsx";


const mockProducts = [
    {
        id: 1,
        name: "MacBook Pro 16-inch",
        model: "M3 Pro",
        brand: "Apple",
        category: "Laptops",
        price: 249999,
        availability: 15,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        rating: 4.8,
        reviews: 1247,
        description: "Supercharged by M3 Pro and M3 Max, MacBook Pro takes its power and efficiency further than ever.",
        status: 'active'
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        model: "A3104",
        brand: "Apple",
        category: "Smartphones",
        price: 134900,
        availability: 8,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
        rating: 4.6,
        reviews: 892,
        description: "Forged from titanium and featuring the groundbreaking A17 Pro chip.",
        status: 'active'
    },
    {
        id: 3,
        name: "Samsung Galaxy S24 Ultra",
        model: "SM-S928",
        brand: "Samsung",
        category: "Smartphones",
        price: 129999,
        availability: 12,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        rating: 4.5,
        reviews: 567,
        description: "The ultimate smartphone with AI capabilities and pro-grade camera.",
        status: 'active'
    },
    {
        id: 4,
        name: "Sony WH-1000XM5",
        model: "WH-1000XM5",
        brand: "Sony",
        category: "Audio",
        price: 29990,
        availability: 25,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
        rating: 4.7,
        reviews: 2341,
        description: "Industry-leading noise cancellation with exceptional sound quality.",
        status: 'active'
    },
    {
        id: 5,
        name: "iPad Air",
        model: "5th Gen",
        brand: "Apple",
        category: "Tablets",
        price: 59900,
        availability: 6,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        rating: 4.4,
        reviews: 456,
        description: "Powerful. Colorful. Wonderful. With M1 chip and all-screen design.",
        status: 'active'
    },
    {
        id: 6,
        name: "Dell XPS 13",
        model: "XPS 13-9315",
        brand: "Dell",
        category: "Laptops",
        price: 124999,
        availability: 0,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
        rating: 4.3,
        reviews: 789,
        description: "The smallest 13-inch laptop with InfinityEdge display.",
        status: 'disabled'
    },
    {
        id: 7,
        name: "AirPods Pro",
        model: "2nd Gen",
        brand: "Apple",
        category: "Audio",
        price: 24900,
        availability: 30,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
        rating: 4.6,
        reviews: 1567,
        description: "Active Noise Cancellation and Adaptive Transparency.",
        status: 'active'
    },
    {
        id: 8,
        name: "Samsung Galaxy Tab S9",
        model: "SM-X710",
        brand: "Samsung",
        category: "Tablets",
        price: 79999,
        availability: 10,
        image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=300&fit=crop",
        rating: 4.4,
        reviews: 234,
        description: "Powerful tablet with S Pen and stunning display.",
        status: 'active'
    }
];

const fuzzySearch = (query, text) => {
    if (!query) return true;

    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    if (textLower.includes(queryLower)) return true;

    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
            queryIndex++;
        }
    }

    return queryIndex === queryLower.length;
};

function ProductShop() {
    const [products, setProducts] = useState(mockProducts);
    const [filteredProducts, setFilteredProducts] = useState(mockProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 300000]);
    const [availability, setAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const categories = useMemo(() =>
            [...new Set(products.map(product => product.category))],
        [products]
    );

    const brands = useMemo(() =>
            [...new Set(products.map(product => product.brand))],
        [products]
    );

    useEffect(() => {
        let results = products;

        if (searchQuery) {
            results = results.filter(product =>
                fuzzySearch(searchQuery, product.name) ||
                fuzzySearch(searchQuery, product.brand) ||
                fuzzySearch(searchQuery, product.category) ||
                fuzzySearch(searchQuery, product.description)
            );
        }

        if (selectedCategories.length > 0) {
            results = results.filter(product =>
                selectedCategories.includes(product.category)
            );
        }
        if (selectedBrands.length > 0) {
            results = results.filter(product =>
                selectedBrands.includes(product.brand)
            );
        }
        results = results.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        if (availability === 'in-stock') {
            results = results.filter(product => product.availability > 0);
        } else if (availability === 'out-of-stock') {
            results = results.filter(product => product.availability === 0);
        }

        switch (sortBy) {
            case 'price-low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                results.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(results);
    }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, availability, sortBy]);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([0, 300000]);
        setAvailability('all');
        setSortBy('featured');
    };

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'name', label: 'Name A-Z' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-0">
            <div className="container mx-auto px-2 py-2">

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full lg:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products, brands, categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 min-w-[160px] justify-between"
                                >
                                    <span className="text-sm">
                                        {sortOptions.find(opt => opt.value === sortBy)?.label}
                                    </span>
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isSortOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                                                    sortBy === option.value
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'text-gray-700'
                                                } first:rounded-t-lg last:rounded-b-lg`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                                <Filter size={18} />
                                <span className="text-sm">Filters</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
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
                                <h3 className="font-medium text-gray-900 mb-3 text-sm">Price Range</h3>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="300000"
                                        step="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Rs. 0</span>
                                        <span>Rs. {priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3 text-sm">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3 text-sm">Brands</h3>
                                <div className="space-y-2">
                                    {brands.map(brand => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
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
                                <h3 className="font-medium text-gray-900 mb-3 text-sm">Availability</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: 'All Products' },
                                        { value: 'in-stock', label: 'In Stock' },
                                        { value: 'out-of-stock', label: 'Out of Stock' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="availability"
                                                value={option.value}
                                                checked={availability === option.value}
                                                onChange={(e) => setAvailability(e.target.value)}
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
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {selectedCategories.map(category => (
                                    <span key={category} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                        {category}
                                        <button onClick={() => toggleCategory(category)}>
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                {selectedBrands.map(brand => (
                                    <span key={brand} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        {brand}
                                        <button onClick={() => toggleBrand(brand)}>
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-3">
                                    <Search size={48} className="mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4 text-sm">Try adjusting your search or filters</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                    onClick={() => setIsFilterOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Price Range</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="300000"
                                            step="1000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Rs. 0</span>
                                            <span>Rs. {priceRange[1].toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Categories</h3>
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <label key={category} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                                                />
                                                <span className="text-sm text-gray-700">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Brands */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Brands</h3>
                                    <div className="space-y-2">
                                        {brands.map(brand => (
                                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => toggleBrand(brand)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                                                />
                                                <span className="text-sm text-gray-700">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Availability</h3>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'all', label: 'All Products' },
                                            { value: 'in-stock', label: 'In Stock' },
                                            { value: 'out-of-stock', label: 'Out of Stock' }
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="availability-mobile"
                                                    value={option.value}
                                                    checked={availability === option.value}
                                                    onChange={(e) => setAvailability(e.target.value)}
                                                    className="text-green-600 focus:ring-green-500 w-4 h-4"
                                                />
                                                <span className="text-sm text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductShop;
