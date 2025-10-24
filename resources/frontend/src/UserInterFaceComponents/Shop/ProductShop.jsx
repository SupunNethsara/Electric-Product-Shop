import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from "../Products/ProductCard.jsx";
import ShopHeader from "./ShopComponents/ShopHeader.jsx";
import FillterSidebar from "./ShopComponents/FillterSidebar.jsx";
import ProductSection from "./ShopComponents/ProductSection.jsx";
import MobileFilterDrawer from "./ShopComponents/MobileFilterDrawer.jsx";


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
                <ShopHeader
                    sortOptions={sortOptions}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    isSortOpen={isSortOpen}
                    setIsSortOpen={setIsSortOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <div className="flex gap-6">
                    <FillterSidebar
                        isFilterOpen={isFilterOpen}
                        selectedCategories={selectedCategories}
                        selectedBrands={selectedBrands}
                        priceRange={priceRange}
                        availability={availability}
                        categories={categories}
                        brands={brands}
                        toggleCategory={toggleCategory}
                        toggleBrand={toggleBrand}
                        setPriceRange={setPriceRange}
                        setAvailability={setAvailability}
                        clearAllFilters={clearAllFilters}
                    />
                    <ProductSection
                        filteredProducts={filteredProducts}
                        searchQuery={searchQuery}
                        selectedCategories={selectedCategories}
                        selectedBrands={selectedBrands}
                        toggleCategory={toggleCategory}
                        toggleBrand={toggleBrand}
                        clearAllFilters={clearAllFilters}
                    />
                </div>
            </div>

            {isFilterOpen && (
                <MobileFilterDrawer
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    priceRange={priceRange}
                    availability={availability}
                    categories={categories}
                    brands={brands}
                    toggleCategory={toggleCategory}
                    toggleBrand={toggleBrand}
                    setPriceRange={setPriceRange}
                    setAvailability={setAvailability}
                    clearAllFilters={clearAllFilters}
                />
            )}
        </div>
    );
}

export default ProductShop;
