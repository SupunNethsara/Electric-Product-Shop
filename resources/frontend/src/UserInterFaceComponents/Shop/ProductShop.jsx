import React, {useEffect, useState, useCallback} from 'react';
import ShopHeader from "./ShopComponents/ShopHeader.jsx";
import FillterSidebar from "./ShopComponents/FillterSidebar.jsx";
import ProductSection from "./ShopComponents/ProductSection.jsx";
import MobileFilterDrawer from "./ShopComponents/MobileFilterDrawer.jsx";
import axios from "axios";

function ProductShop() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
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
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getAllChildCategoryIds = (parentId, allCategories) => {
        const result = new Set();
        result.add(parentId);
        const findChildren = (currentParentId) => {
            const children = allCategories.filter(cat => cat.parent_id === currentParentId);
            children.forEach(child => {
                result.add(child.id);
                findChildren(child.id);
            });
        };

        findChildren(parentId);
        return Array.from(result);
    };

    const getCategoryIdsWithChildren = (selectedCategoryIds, allCategories) => {
        const result = new Set();

        selectedCategoryIds.forEach(categoryId => {
            const categoryAndChildren = getAllChildCategoryIds(categoryId, allCategories);
            categoryAndChildren.forEach(id => result.add(id));
        });

        return Array.from(result);
    };

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/products/active', {
                    params: { per_page: 1000 }
                });

                const products = response.data.data || [];
                setAllProducts(products);
                setFilteredProducts(products);
                setTotalProducts(products.length);
            } catch (error) {
                console.error('Error fetching products:', error);
                setAllProducts([]);
                setFilteredProducts([]);
                setTotalProducts(0);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (initialLoad || categories.length === 0) return;
        applyFilters();
    }, [searchQuery, selectedCategories, priceRange, availability, sortBy, allProducts, categories]);

    const applyFilters = useCallback(() => {
        if (allProducts.length === 0) {
            setFilteredProducts([]);
            setTotalProducts(0);
            return;
        }

        let filtered = [...allProducts];

        if (selectedCategories.length > 0) {
            const allCategoryIdsToFilter = getCategoryIdsWithChildren(selectedCategories, categories);
            const categoryFilterSet = new Set(allCategoryIdsToFilter);

            console.log('🔍 Selected categories:', selectedCategories);
            console.log('📦 All category IDs to filter (including children):', allCategoryIdsToFilter);
            console.log('📋 Total products before filter:', filtered.length);

            const categoryMap = {};
            categories.forEach(cat => {
                categoryMap[cat.id] = cat.name;
            });

            const selectedCategoryNames = selectedCategories.map(id => ({
                id,
                name: categoryMap[id] || 'Unknown Category',
                isSelected: true
            }));

            console.log('🏷️ Selected category details:', selectedCategoryNames);

            filtered = filtered.filter(product => {
                const productCategoryIds = [
                    product.category_id,
                    product.category_2_id,
                    product.category_3_id
                ].filter(Boolean);

                const hasMatch = categoryFilterSet.has(product.category_id);

                if (hasMatch) {
                    console.log(`✅ MATCH: ${product.name}`, {
                        itemCode: product.item_code,
                        primaryCategory: {
                            id: product.category_id,
                            name: categoryMap[product.category_id] || 'Unknown Category'
                        },
                        allCategories: productCategoryIds.map(id => ({
                            id,
                            name: categoryMap[id] || 'Unknown Category',
                            isInFilter: categoryFilterSet.has(id)
                        }))
                    });
                } else {
                    console.log(`❌ NO MATCH: ${product.name}`, {
                        itemCode: product.item_code,
                        primaryCategory: {
                            id: product.category_id,
                            name: categoryMap[product.category_id] || 'Unknown Category'
                        },
                        allCategories: productCategoryIds.map(id => ({
                            id,
                            name: categoryMap[id] || 'Unknown Category',
                            isInFilter: categoryFilterSet.has(id)
                        }))
                    });
                }

                return hasMatch;
            });

        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.model?.toLowerCase().includes(query)
            );
        }

        filtered = filtered.filter(product => {
            const price = parseFloat(product.price) || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        if (availability !== 'all') {
            if (availability === 'in-stock') {
                filtered = filtered.filter(product => product.availability > 0);
            } else if (availability === 'out-of-stock') {
                filtered = filtered.filter(product => product.availability === 0);
            }
        }

        // Sorting
        filtered = sortProducts(filtered, sortBy);

        setFilteredProducts(filtered);
        setTotalProducts(filtered.length);
        setCurrentPage(1);
    }, [allProducts, searchQuery, selectedCategories, priceRange, availability, sortBy, categories]);

    const sortProducts = (products, sortType) => {
        const sorted = [...products];

        switch (sortType) {
            case 'price-low':
                return sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
            case 'price-high':
                return sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
            case 'rating':
                return sorted.sort((a, b) => (parseFloat(b.average_rating) || 0) - (parseFloat(a.average_rating) || 0));
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    };

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    };

    const flattenCategories = (categories, level = 0, parentName = '') => {
        let flattened = [];
        categories.forEach(category => {
            const fullPath = parentName ? `${parentName} > ${category.name}` : category.name;
            flattened.push({
                id: category.id,
                name: category.name,
                level: level,
                parent_id: category.parent_id,
                fullPath: fullPath
            });
            if (category.children && category.children.length > 0) {
                const childCategories = flattenCategories(category.children, level + 1, category.name);
                flattened = flattened.concat(childCategories);
            }
        });
        return flattened;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories/active');
                const categoriesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
                const flattenedCategories = flattenCategories(categoriesData);
                setCategories(flattenedCategories);
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
    };

    const clearAllFilters = () => {
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
                            filteredProducts={getPaginatedProducts()}
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
