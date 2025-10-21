import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleBuyClick = () => {
        if (!isAuthenticated || role !== 'user') {
            navigate('/login', {
                state: {
                    from: '/checkout',
                    message: 'Please login to purchase products'
                }
            });
            return;
        }
        navigate('/checkout', { state: { product } });
    };

    return (
        <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
            {/* Product Image */}
            <div className="relative overflow-hidden">
                <img
                    src={product.image || `https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&auto=format&q=80`}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badge */}
                {product.status === 'disabled' && (
                    <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3">
                    {product.model}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-green-600 font-semibold">
                        {product.availability} in stock
                    </span>
                </div>

                {/* Buy Button */}
                <button
                    onClick={handleBuyClick}
                    disabled={product.status === 'disabled'}
                    className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors duration-300 ${
                        isAuthenticated && role === 'user' && product.status !== 'disabled'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {product.status === 'disabled' ? (
                        'Out of Stock'
                    ) : isAuthenticated && role === 'user' ? (
                        'Buy Now'
                    ) : (
                        'Login to Buy'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
