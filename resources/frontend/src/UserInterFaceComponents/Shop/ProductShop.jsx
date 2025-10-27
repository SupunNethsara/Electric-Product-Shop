import React, {useEffect, useMemo, useState} from 'react';
import ShopHeader from "./ShopComponents/ShopHeader.jsx";
import FillterSidebar from "./ShopComponents/FillterSidebar.jsx";
import ProductSection from "./ShopComponents/ProductSection.jsx";
import MobileFilterDrawer from "./ShopComponents/MobileFilterDrawer.jsx";
import axios from "axios";

const fuzzySearch = (query, text) => {
    if (!query) return true;
    if (!text) return false;

    const queryLower = query.toString().toLowerCase();
    const textLower = text.toString().toLowerCase();

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
    const [categories, setCategories] = useState([]);
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
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories/active');
                const categoriesData = Array.isArray(response.data) ? response.data : response.data.data || [];
                const categoryItems = categoriesData.map(cat => ({
                    id: cat.id,
                    name: cat.name
                }));
                setCategories(categoryItems);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/active');
                const productsData = response.data.data || [];
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            }
        };
        fetchProducts();
        fetchCategories();
    }, []);

    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(products.map(product => product.brand).filter(Boolean))];
        return uniqueBrands;
    }, [products]);

    const displayCategories = useMemo(() => {
        if (categories.length === 0) return [];

        const productCategoryIds = [...new Set(products.map(product => product.category_id).filter(Boolean))];

      return categories.filter(cat =>
            productCategoryIds.includes(cat.id)
        );
    }, [categories, products]);

    useEffect(() => {
        let results = products;

        if (searchQuery) {
            results = results.filter(product =>
                fuzzySearch(searchQuery, product.name) ||
                fuzzySearch(searchQuery, product.brand) ||
                fuzzySearch(searchQuery, product.description)
            );
        }

        if (selectedCategories.length > 0) {
            results = results.filter(product =>
                selectedCategories.includes(product.category_id)
            );
        }

        if (selectedBrands.length > 0) {
            results = results.filter(product =>
                selectedBrands.includes(product.brand)
            );
        }

        results = results.filter(product => {
            const price = Number(product.price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

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
                results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name':
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(results);
    }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, availability, sortBy]);

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
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
                        categories={displayCategories}
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
                        categories={categories}
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
                    categories={displayCategories}
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
