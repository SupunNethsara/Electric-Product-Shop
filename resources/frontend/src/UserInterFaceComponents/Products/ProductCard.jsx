import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const handleBuyClick = () => {
        navigate('/productDetails', { state: { product } });
    };

    const originalPrice = parseFloat(product.price) * 1.3;
    const discountPercent = Math.round(((originalPrice - parseFloat(product.price)) / originalPrice) * 100);

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
                </div>

                {product.status === 'disabled' && (
                    <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 text-xs font-bold rounded">
                        Out of Stock
                    </div>
                )}
            </div>

            <div className="p-4 pt-3">
                <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 h-10 leading-tight">
                    {product.name} - {product.model}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center bg-green-600 text-white px-1 py-0.5 rounded text-xs font-bold">
                        <span>{4.2}</span>
                        <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500">225</span>
                </div>

                <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-bold text-green-600">Rs. {product.price}</span>
                        <span className="text-sm text-gray-500 line-through">Rs. {originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                        <span className="text-green-600 font-semibold">{product.availability}</span> pieces available
                    </div>
                </div>

                {/* Free Shipping Badge */}
                {/*<div className="mb-3">*/}
                {/*    <span className="inline-block bg-green-50 text-green-600 text-xs px-2 py-1 rounded border border-green-200">*/}
                {/*        🚚 Free Shipping*/}
                {/*    </span>*/}
                {/*</div>*/}

                <button
                    onClick={handleBuyClick}
                    disabled={product.status === 'disabled'}
                    className={`w-full py-2 px-4 rounded text-sm font-semibold transition-all duration-200 ${
                        product.status !== 'disabled'
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {product.status === 'disabled' ? (
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
