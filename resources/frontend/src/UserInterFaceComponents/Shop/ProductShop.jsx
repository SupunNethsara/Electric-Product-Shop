import React, {useEffect, useState, useCallback} from 'react';
import ShopHeader from "./ShopComponents/ShopHeader.jsx";
import FillterSidebar from "./ShopComponents/FillterSidebar.jsx";
import ProductSection from "./ShopComponents/ProductSection.jsx";
import MobileFilterDrawer from "./ShopComponents/MobileFilterDrawer.jsx";
import axios from "axios";

function ProductShop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 300000]);
    const [availability, setAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
                per_page: itemsPerPage,
            };

            if (searchQuery && searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
            if (priceRange[0] > 0) params.min_price = priceRange[0];
            if (priceRange[1] < 300000) params.max_price = priceRange[1];
            if (availability !== 'all') params.availability = availability;
            if (sortBy !== 'featured') params.sort_by = sortBy;

            console.log('🔍 Fetching products with params:', params);

            const response = await axios.get('http://127.0.0.1:8000/api/products/active', {
                params: params
            });

            setProducts(response.data.data || []);
            setTotalProducts(response.data.meta?.total || 0);
        } catch (error) {
            console.error('Error fetching products:', error);
            console.error('Error details:', error.response?.data);
            setProducts([]);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, selectedCategories, priceRange, availability, sortBy]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories/active');
                const categoriesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
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

        fetchCategories();
    }, []);

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        console.log('🧹 Clearing all filters');
        setSearchInput('');
        setSearchQuery('');
        setSelectedCategories([]);
        setPriceRange([0, 300000]);
        setAvailability('all');
        setSortBy('featured');
        setCurrentPage(1);
    };

    const handleSearch = () => {
        const trimmedInput = searchInput.trim();
        if (trimmedInput !== searchQuery) {
            setSearchQuery(trimmedInput);
            setCurrentPage(1);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setCurrentPage(1);
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
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearch}
                    onKeyPress={handleKeyPress}
                    onClearSearch={handleClearSearch}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    totalProducts={totalProducts}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={Math.ceil(totalProducts / itemsPerPage)}
                />

                <div className="flex gap-6">
                    <FillterSidebar
                        isFilterOpen={isFilterOpen}
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                        availability={availability}
                        categories={categories}
                        toggleCategory={toggleCategory}
                        setPriceRange={setPriceRange}
                        setAvailability={setAvailability}
                        clearAllFilters={clearAllFilters}
                    />

                    <div className="flex-1">
                        <ProductSection
                            filteredProducts={products}
                            searchQuery={searchQuery}
                            selectedCategories={selectedCategories}
                            categories={categories}
                            toggleCategory={toggleCategory}
                            clearAllFilters={clearAllFilters}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            {isFilterOpen && (
                <MobileFilterDrawer
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    selectedCategories={selectedCategories}
                    priceRange={priceRange}
                    availability={availability}
                    categories={categories}
                    toggleCategory={toggleCategory}
                    setPriceRange={setPriceRange}
                    setAvailability={setAvailability}
                    clearAllFilters={clearAllFilters}
                />
            )}
        </div>
    );
}

export default ProductShop;
