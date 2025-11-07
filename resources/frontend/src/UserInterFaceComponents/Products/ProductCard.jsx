import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [ratingData, setRatingData] = useState({
        average_rating: 0,
        total_reviews: 0
    });
    const [viewCount, setViewCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const handleBuyClick = async () => {
        await trackProductView();
        navigate('/productDetails', { state: { product } });
    };

    const trackProductView = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

            console.log('Token from localStorage:', token ? 'Present (' + token.substring(0, 20) + '...)' : 'Missing');

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
                console.log('Adding Authorization header with Bearer token');
            }

            const response = await fetch(`http://127.0.0.1:8000/api/products/${product.id}/track-view`, {
                method: 'POST',
                headers: headers,
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ View tracked successfully:', data);
                if (data.debug) {
                    console.log('🔍 Debug info:', data.debug);
                }
            } else {
                console.error(' Failed to track view:', data);
            }

        } catch (error) {
            console.error(' Network error tracking view:', error);
        }
    };
    const fetchRatingData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/api/products/${product.id}/rating-summary`);

            if (response.ok) {
                const data = await response.json();
                setRatingData({
                    average_rating: data.average_rating || 0,
                    total_reviews: data.total_reviews || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch rating data:', error);
            setRatingData({
                average_rating: product.average_rating || 0,
                total_reviews: product.reviews_count || 0
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchViewStats = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products/${product.id}/view-stats`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setViewCount(data.data.total_views || 0);
                }
            }
        } catch (error) {
            console.error('Failed to fetch view stats:', error);
        }
    };

    useEffect(() => {
        fetchRatingData();
        fetchViewStats();
    }, [product.id]);

    const originalPrice = parseFloat(product.price) * 1.3;
    const discountPercent = Math.round(((originalPrice - parseFloat(product.price)) / originalPrice) * 100);

    const isOutOfStock = product.status === 'disabled' || product.availability === 0;

    return (
        <div className="bg-white border border-gray-200 rounded-sm hover:shadow-lg transition-all duration-200 hover:border-green-500 group">
            <div className="relative p-4 pb-0">
                <div className="relative overflow-hidden">
                    <img
                        src={product.image || `https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&auto=format&q=80`}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        {discountPercent}% OFF
                    </div>

                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
                        <Eye size={12} />
                        {viewCount}
                    </div>
                </div>

                {isOutOfStock && (
                    <div className="absolute top-10 right-2 bg-gray-600 text-white px-2 py-1 text-xs font-bold rounded">
                        Out of Stock
                    </div>
                )}
            </div>

            <div className="p-4 pt-3">
                <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 h-10 leading-tight">
                    {product.name} - {product.model}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-200 text-gray-200 px-1 py-0.5 rounded text-xs font-bold animate-pulse">
                                <span>0.0</span>
                                <Star size={12} className="ml-0.5" />
                            </div>
                            <span className="text-xs text-gray-300 animate-pulse">(0)</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center bg-green-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                                <span>{ratingData.average_rating.toFixed(1)}</span>
                                <Star size={12} className="ml-0.5 fill-current" />
                            </div>
                            <span className="text-xs text-gray-500">
                                ({ratingData.total_reviews})
                            </span>
                        </>
                    )}
                </div>

                <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-md font-bold text-green-600">Rs. {product.price}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                        <span className={`font-semibold ${
                            isOutOfStock ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {isOutOfStock ? 'Out of stock' : `${product.availability} pieces available`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleBuyClick}
                    disabled={isOutOfStock}
                    className={`w-full py-2 px-4 rounded text-sm font-semibold transition-all duration-200 ${
                        !isOutOfStock
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {isOutOfStock ? (
                        'Out of Stock'
                    ) : (
                        <span className="flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            BUY NOW
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
