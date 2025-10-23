import React from 'react';

function ProductShop() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Our Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Product cards will go here */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="h-48 bg-gray-200 mb-4 rounded"></div>
                    <h3 className="font-semibold text-lg">Product Name</h3>
                    <p className="text-gray-600">Product description goes here</p>
                    <div className="mt-2 font-bold">$99.99</div>
                </div>
            </div>
        </div>
    );
}

export default ProductShop;
