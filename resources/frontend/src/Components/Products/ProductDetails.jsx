import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
    const { id } = useParams();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product Details</h1>
            <p>Product ID: {id}</p>
        </div>
    );
}

export default ProductDetails;
