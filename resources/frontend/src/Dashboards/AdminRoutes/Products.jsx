import React, { useState } from 'react';
import UploadProducts from "./ProductsComponents/UploadProducts.jsx";
import ProductsTable from "./ProductsComponents/ProductsTable.jsx";

const Products = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [refreshProducts, setRefreshProducts] = useState(false);

    const handleUploadComplete = () => {
        setActiveTab('products');
        setRefreshProducts(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Product Management
                    </h1>
                    <p className="text-gray-600">
                        Upload and manage your product catalog
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                                activeTab === 'upload'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('upload')}
                        >
                            Upload Products
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                                activeTab === 'products'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('products')}
                        >
                            View Products
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'upload' && (
                            <UploadProducts onUploadComplete={handleUploadComplete} />
                        )}
                        {activeTab === 'products' && (
                            <ProductsTable refreshTrigger={refreshProducts} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
