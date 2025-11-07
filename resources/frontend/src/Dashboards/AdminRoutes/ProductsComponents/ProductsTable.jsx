import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductRow from './ProductRow';
import { Search, Filter, Eye, X } from 'lucide-react';

const ProductsTable = ({ refreshTrigger }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        minPrice: '',
        maxPrice: '',
        inStock: false
    });
    const handleStatusToggle = async (productId, newStatus) => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/products/${productId}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                // Update the local state
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.id === productId
                            ? { ...product, status: newStatus }
                            : product
                    )
                );

                // Show success message
                alert(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
            }
        } catch (error) {
            console.error('Failed to toggle product status:', error);
            alert('Failed to update product status. Please try again.');
            throw error;
        }
    };
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products');
            if (response.data && response.data.data) {
                setProducts(response.data.data);
            } else if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.warn('Unexpected API response structure:', response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]);

    const handleImagesUpload = async (productId, itemCode, files, mainImageIndex = 0) => {
        if (files.length > 4) {
            alert('Maximum 4 images allowed!');
            return;
        }

        try {
            const uploadPromises = Array.from(files).map(file => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "eSupport_Product");

                return axios.post(
                    "https://api.cloudinary.com/v1_1/dbn9uenrg/image/upload",
                    formData
                );
            });

            const cloudinaryResponses = await Promise.all(uploadPromises);
            const imageUrls = cloudinaryResponses.map(response => response.data.secure_url);

            const response = await axios.post("http://127.0.0.1:8000/api/products/upload-images", {
                product_id: productId,
                item_code: itemCode,
                image_urls: imageUrls,
                main_image_index: mainImageIndex
            });

            alert(`Successfully uploaded ${imageUrls.length} image(s)!`);
            fetchProducts();
            return response.data;
        } catch (error) {
            console.error('Upload failed:', error);

            let errorMessage = 'Failed to upload images. ';

            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage += 'Product not found. It may have been deleted. Please refresh the page and try again.';
                } else if (error.response.data?.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    errorMessage += errorMessages.join(' ');
                } else if (error.response.data?.message) {
                    errorMessage += error.response.data.message;
                } else {
                    errorMessage += 'Please try again later.';
                }
            } else if (error.request) {
                errorMessage += 'No response from server. Please check your connection.';
            } else {
                errorMessage += error.message;
            }

            alert(errorMessage);
            throw error;
        }
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            minPrice: '',
            maxPrice: '',
            inStock: false
        });
    };

    const filteredProducts = Array.isArray(products) ? products.filter(product => {
        if (!product || typeof product !== 'object') return false;

        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase().trim();
            const searchFields = [
                product.name || '',
                product.item_code || '',
                product.model || ''
            ];

            const matchesSearch = searchFields.some(field =>
                field.toString().toLowerCase().includes(searchTerm)
            );

            if (!matchesSearch) return false;
        }

        if (filters.status !== 'all' && product.status !== filters.status) {
            return false;
        }

        if (filters.minPrice) {
            const productPrice = parseFloat(product.buy_now_price || product.price || 0);
            if (productPrice < parseFloat(filters.minPrice)) {
                return false;
            }
        }
        if (filters.maxPrice) {
            const productPrice = parseFloat(product.buy_now_price || product.price || 0);
            if (productPrice > parseFloat(filters.maxPrice)) {
                return false;
            }
        }
        if (filters.inStock && (!product.availability || product.availability <= 0)) {
            return false;
        }

        return true;
    }) : [];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Product Catalog</h2>
                    <div className="text-sm text-gray-600 mt-1">
                        {filteredProducts.length} of {products.length} products
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-48"
                        />
                    </div>

                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                    </select>

                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">In Stock</span>
                    </label>
                    {(filters.search || filters.status !== 'all' || filters.minPrice || filters.maxPrice || filters.inStock) && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
            {(filters.search || filters.status !== 'all' || filters.minPrice || filters.maxPrice || filters.inStock) && (
                <div className="flex flex-wrap gap-2">
                    {filters.search && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Search: "{filters.search}"
                        </span>
                    )}
                    {filters.status !== 'all' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            Status: {filters.status}
                        </span>
                    )}
                    {filters.minPrice && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Min: ${filters.minPrice}
                        </span>
                    )}
                    {filters.maxPrice && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                            Max: ${filters.maxPrice}
                        </span>
                    )}
                    {filters.inStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                            In Stock Only
                        </span>
                    )}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Main Image
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                All Images
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Code
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Model
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                Stock
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                View Details
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onImagesUpload={handleImagesUpload}
                                    onViewDetails={handleViewDetails}
                                    onStatusToggle={handleStatusToggle}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    {products.length > 0 ? 'No matching products found' : 'No products available'}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredProducts.length === 0 && !loading && (
                <EmptyState />
            )}

            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Product Details - {selectedProduct.name}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Item Code:</span>
                                            <span className="font-medium">{selectedProduct.item_code}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Model:</span>
                                            <span className="font-medium">{selectedProduct.model}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedProduct.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedProduct.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Warranty:</span>
                                            <span className="font-medium">{selectedProduct.warranty}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Pricing & Stock</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Regular Price:</span>
                                            <span className="font-medium">Rs. {selectedProduct.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Buy Now Price:</span>
                                            <span className="font-medium text-green-600">Rs. {selectedProduct.buy_now_price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Availability:</span>
                                            <span className="font-medium">{selectedProduct.availability} units</span>
                                        </div>
                                        {selectedProduct.tags && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tags:</span>
                                                <span className="font-medium text-right">{selectedProduct.tags}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedProduct.hedding && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Product Heading</h4>
                                    <p className="text-sm text-gray-700">{selectedProduct.hedding}</p>
                                </div>
                            )}

                            {selectedProduct.specification && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
                                    <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap font-sans">
                                        {selectedProduct.specification}
                                    </pre>
                                </div>
                            )}

                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Ratings & Reviews</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-gray-900">{selectedProduct.average_rating || 0}</div>
                                        <div className="text-gray-600">Average Rating</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-gray-900">{selectedProduct.reviews_count || 0}</div>
                                        <div className="text-gray-600">Total Reviews</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-gray-900">
                                            {selectedProduct.rating_distribution?.['5'] || 0}
                                        </div>
                                        <div className="text-gray-600">5 Star Reviews</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-gray-900">
                                            {selectedProduct.rating_distribution?.['1'] || 0}
                                        </div>
                                        <div className="text-gray-600">1 Star Reviews</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Created:</span>
                                    <span className="ml-2 font-medium">
                                        {new Date(selectedProduct.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="ml-2 font-medium">
                                        {new Date(selectedProduct.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
        </p>
    </div>
);

export default ProductsTable;
