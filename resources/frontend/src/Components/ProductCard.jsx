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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-2">${product.price}</p>

                <button
                    onClick={handleBuyClick}
                    className={`mt-4 w-full py-2 px-4 rounded-md font-medium ${
                        isAuthenticated && role === 'user'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    // disabled={!isAuthenticated || role !== 'user'}
                >
                    {isAuthenticated && role === 'user' ? 'Buy Now' : 'Login to Buy'}
                </button>

                {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        Please login to purchase
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
