import React, {useEffect, useMemo, useState} from 'react';
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
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 300000]);
    const [availability, setAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);

    // Build query parameters
    const buildQueryParams = useMemo(() => {
        const params = {
            page: currentPage,
            per_page: itemsPerPage,
        };

        if (searchQuery) params.search = searchQuery;
        if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
        if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
        if (priceRange[0] > 0) params.min_price = priceRange[0];
        if (priceRange[1] < 300000) params.max_price = priceRange[1];
        if (availability !== 'all') params.availability = availability;
        if (sortBy !== 'featured') params.sort_by = sortBy;

        return params;
    }, [currentPage, itemsPerPage, searchQuery, selectedCategories, selectedBrands, priceRange, availability, sortBy]);

    // Fetch products with filters and pagination
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/products/active', {
                params: buildQueryParams
            });

            setProducts(response.data.data);
            setTotalProducts(response.data.meta.total);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [buildQueryParams]);

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

        fetchCategories();
    }, []);

    // Get unique brands from ALL products (you might want to create a brands API endpoint)
    const brands = useMemo(() => {
        // For better performance, consider creating a brands API endpoint
        return ['Brand A', 'Brand B', 'Brand C']; // Replace with actual brands from API
    }, []);

    const displayCategories = useMemo(() => {
        return categories;
    }, [categories]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategories, selectedBrands, priceRange, availability, sortBy]);

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
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
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
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
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

                    <div className="flex-1">
                        <ProductSection
                            filteredProducts={products}
                            searchQuery={searchQuery}
                            selectedCategories={selectedCategories}
                            selectedBrands={selectedBrands}
                            categories={categories}
                            toggleCategory={toggleCategory}
                            toggleBrand={toggleBrand}
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
