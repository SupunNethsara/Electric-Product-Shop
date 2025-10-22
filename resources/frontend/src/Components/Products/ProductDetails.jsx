import React from 'react';
import {useLocation, useParams} from 'react-router-dom';

function ProductDetails() {
    const location = useLocation();
    const { product } = location.state || {};
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product Details</h1>

        </div>
    );
}

export default ProductDetails;
