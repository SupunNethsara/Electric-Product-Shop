import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Truck,
    Shield,
    Check,
    AlertCircle,
    ZoomIn,
    ChevronLeft,
    RotateCcw,
    ChevronRight
} from 'lucide-react';
import { openLoginModal } from "../../Store/slices/modalSlice.js";
import { addToCart } from "../../Store/slices/cartSlice.js";
import useToast from "../Common/useToast.jsx";

const ProductDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { isAuthenticated } = useSelector(state => state.auth);
    const { cartLoading } = useSelector(state => state.cart);

    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const { success, error: showError } = useToast();

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!location.state?.product && id) {
                try {
                    setLoading(true);
                    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
                    if (!response.ok) throw new Error('Product not found');
                    const productData = await response.json();
                    setProduct(productData);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();
    }, [id, location.state]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }

        if (product.availability === 0) {
            showError('This product is out of stock', 'Out of Stock');
            return;
        }

        setAddingToCart(true);
        try {
            await dispatch(addToCart({
                product_id: product.id,
                quantity: quantity
            })).unwrap();
            success('Product added to cart successfully!');
        } catch (error) {
            showError(error || 'Failed to add product to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }

        if (product.availability === 0) {
            showError('This product is out of stock', 'Out of Stock');
            return;
        }
        navigate('/checkout', {
            state: {
                directBuy: true,
                product: product,
                quantity: quantity
            }
        });
    };

    const handleWishlist = () => {
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }
        setIsWishlisted(!isWishlisted);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    };

    const getProductImages = () => {
        if (product.images) {
            try {
                return JSON.parse(product.images);
            } catch {
                return [product.image];
            }
        }
        return [product.image || '/images/placeholder-product.png'];
    };

    const productImages = getProductImages();
    const currentPrice = parseFloat(product?.price || 0);
    const originalPrice = currentPrice * 1.3;
    const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    const savings = originalPrice - currentPrice;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {error || 'Product Not Found'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ? error : "We couldn't find the product you're looking for. It might be unavailable or removed."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Products
                            </button>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                        <div className="space-y-4">
                            <div className="relative group aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={productImages[selectedImage] || '/images/placeholder-product.png'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                    onClick={() => setShowZoomModal(true)}
                                    className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ZoomIn size={20} />
                                </button>
                            </div>

                            {productImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === index
                                                    ? 'border-green-500 ring-2 ring-green-200'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">
                                            {product.category || 'Electronics'} › {product.subcategory || 'Gadgets'}
                                        </div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                            {product.name}
                                        </h1>
                                        {product.model && (
                                            <p className="text-gray-600 mt-1">
                                                Model: {product.model}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Share this product"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-semibold">
                                            <span>4.8</span>
                                            <Star size={14} className="ml-1 fill-current" />
                                        </div>
                                        <span className="text-gray-600 text-sm">
                                            (128 reviews)
                                        </span>
                                    </div>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        product.availability > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.availability > 0 ? (
                                            <>
                                                <Check size={14} className="mr-1" />
                                                {product.availability} in stock
                                            </>
                                        ) : (
                                            'Out of stock'
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border border-green-100">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-3xl font-bold text-green-600">
                                        Rs. {currentPrice.toLocaleString()}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        Rs. {originalPrice.toLocaleString()}
                                    </span>
                                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                        {discountPercent}% OFF
                                    </span>
                                </div>
                                <p className="text-green-600 font-medium">
                                    You save Rs. {savings.toLocaleString()}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <Truck size={20} className="text-blue-600 flex-shrink-0" />
                                    <div>
                                        <div className="font-medium text-blue-900 text-sm">Free Shipping</div>
                                        <div className="text-blue-700 text-xs">On orders over Rs. 1,999</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <Shield size={20} className="text-orange-600 flex-shrink-0" />
                                    <div>
                                        <div className="font-medium text-orange-900 text-sm">1 Year Warranty</div>
                                        <div className="text-orange-700 text-xs">Quality guaranteed</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-900 min-w-20">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={quantity <= 1 || product.availability === 0 || addingToCart}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 border-x border-gray-300 min-w-12 text-center font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.availability, quantity + 1))}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={quantity >= product.availability || product.availability === 0 || addingToCart}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {product.availability > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {product.availability} available
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.availability === 0 || addingToCart || cartLoading}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 active:bg-green-100 transition-colors font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={18} className="flex-shrink-0" />
                                                <span>{product.availability === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={product.availability === 0 || addingToCart || cartLoading}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 transition-colors font-medium text-base shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {addingToCart ? 'Processing...' : (product.availability === 0 ? 'Out of Stock' : 'Buy Now')}
                                    </button>
                                    <button
                                        onClick={handleWishlist}
                                        className="w-12 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-60"
                                        disabled={addingToCart}
                                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                        <Heart
                                            size={20}
                                            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200">
                        <div className="px-6 lg:px-8">
                            <div className="flex overflow-x-auto gap-8 border-b border-gray-200">
                                {[
                                    { id: 'description', label: 'Description' },
                                    { id: 'specifications', label: 'Specifications' },
                                    { id: 'reviews', label: 'Reviews' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'border-green-600 text-green-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            {activeTab === 'description' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description || "This high-quality product is designed to deliver exceptional performance and reliability. Crafted with precision and attention to detail, it offers outstanding value and meets the highest standards of quality and durability."}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="space-y-6">


                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    </div>

                                    <div className="space-y-6 mt-8">

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {showZoomModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowZoomModal(false)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowZoomModal(false);
                            }}
                            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(prev => (prev > 0 ? prev - 1 : productImages.length - 1));
                                }}
                                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        </div>
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(prev => (prev < productImages.length - 1 ? prev + 1 : 0));
                                }}
                                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <div className="flex items-center justify-center h-full">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="max-w-full max-h-[80vh] object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                                {selectedImage + 1} / {productImages.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
