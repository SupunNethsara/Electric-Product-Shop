import React, { useState, useEffect, useMemo } from 'react';
import ShopHeader from "./ShopComponents/ShopHeader.jsx";
import FillterSidebar from "./ShopComponents/FillterSidebar.jsx";
import ProductSection from "./ShopComponents/ProductSection.jsx";
import MobileFilterDrawer from "./ShopComponents/MobileFilterDrawer.jsx";
import axios from "axios";




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
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 300000]);
    const [availability, setAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/active');
                setProducts(response.data.data);
                console.log('products' , products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    },[]);

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
