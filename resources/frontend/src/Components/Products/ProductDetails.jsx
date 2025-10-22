import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';

function ProductDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }
    const productImages = [
        product.image,
        product.image,
        product.image,
        product.image
    ];

    const originalPrice = parseFloat(product.price) * 1.3;
    const discountPercent = Math.round(((originalPrice - parseFloat(product.price)) / originalPrice) * 100);
    const rating = 4.2;
    const reviewCount = Math.floor(Math.random() * 1000) + 100;

    const handleAddToCart = () => {
        console.log(`Added ${quantity} of ${product.name} to cart`);
    };

    const handleBuyNow = () => {
        console.log(`Buying ${quantity} of ${product.name}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Products
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        <div className="space-y-3">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border transition-all duration-200 ${
                                            selectedImage === index
                                                ? 'border-green-500 ring-1 ring-green-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500 mb-1">
                                        Electronics › Laptops
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {product.name} - {product.model}
                                    </h1>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                            <span>{rating}</span>
                                            <Star size={14} className="ml-1 fill-current" />
                                        </div>
                                        <span className="text-gray-600 text-sm">({reviewCount} reviews)</span>
                                        <span className="text-green-600 font-semibold text-sm">
                                            {product.availability} in stock
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-1 ml-4">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-lg border transition-all duration-200 ${
                                            isWishlisted
                                                ? 'bg-red-50 border-red-200 text-red-600'
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                                    </button>
                                    <button className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-3xl font-bold text-green-600">
                                        Rs. {product.price}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        Rs. {originalPrice.toFixed(2)}
                                    </span>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                        {discountPercent}% OFF
                                    </span>
                                </div>
                                <p className="text-green-600 font-semibold text-sm">
                                    Save Rs. {(originalPrice - parseFloat(product.price)).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {product.description || "High-quality product with excellent features and reliable performance. Designed to meet your needs with superior craftsmanship."}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                                    <Truck size={16} className="text-blue-600" />
                                    <div>
                                        <div className="font-semibold text-xs">Free Shipping</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                    <RotateCcw size={16} className="text-green-600" />
                                    <div>
                                        <div className="font-semibold text-xs">Easy Returns</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                                    <Shield size={16} className="text-purple-600" />
                                    <div>
                                        <div className="font-semibold text-xs">1Y Warranty</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-900 text-sm">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 border-x border-gray-300 min-w-8 text-center text-sm">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold text-sm"
                                    >
                                        <ShoppingCart size={16} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
