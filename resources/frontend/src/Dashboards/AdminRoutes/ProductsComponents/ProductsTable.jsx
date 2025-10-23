import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductRow from './ProductRow';

const ProductsTable = ({ refreshTrigger }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]);

    const handleImagesUpload = async (productId, itemCode, files, mainImageIndex = 0) => {
        if (files.length > 3) {
            alert('Maximum 3 images allowed!');
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Product Catalog</h2>
                <div className="text-sm text-gray-600">
                    {products.length} products
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Main Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                All Images
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Model
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                onImagesUpload={handleImagesUpload}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {products.length === 0 && (
                <EmptyState />
            )}
        </div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p className="mt-1 text-sm text-gray-500">
            Get started by uploading some products.
        </p>
    </div>
);

export default ProductsTable;
