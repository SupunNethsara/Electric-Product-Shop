import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { updateCartItem, removeFromCart, clearError, fetchCartItems } from '../../../Store/slices/cartSlice.js';
import ConfirmationModal from "../../Common/ConfirmationModal.jsx";

function CartSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading, error, totalItems, totalPrice } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState('');

    const discount = 0;
    const shippingFee = 0;
    // const tax = totalPrice * 0.1;
    const grandTotal = totalPrice + shippingFee
        // + tax - discount;

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await dispatch(updateCartItem({
                id: itemId,
                quantity: newQuantity
            })).unwrap();
        } catch (error) {
            alert(error || 'Failed to update quantity');
        }
    };

    const handleRemoveItem = (itemId, itemName) => {
        setSelectedItemId(itemId);
        setSelectedItemName(itemName);
        setShowRemoveConfirm(true);
    };

    const confirmRemoveItem = async () => {
        try {
            await dispatch(removeFromCart(selectedItemId)).unwrap();
        } catch (error) {
            alert(error || 'Failed to remove item');
        } finally {
            setSelectedItemId(null);
            setSelectedItemName('');
        }
    };

    const handleProceedToCheckout = () => {
        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your cart</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            <p className="text-gray-500 text-sm mt-1">{totalItems} items</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Add some products to your cart to see them here</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="font-semibold text-gray-900">Cart Items</h2>
                                    </div>

                                    <div className="divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                                            <img
                                                                src={item.product.image || '/placeholder-image.jpg'}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                                    {item.product.name}
                                                                </h3>
                                                                <p className="text-gray-500 text-xs mb-1">
                                                                    {item.product.model}
                                                                </p>
                                                                <p className="text-green-600 font-semibold">
                                                                    Rs. {parseFloat(item.product.price).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveItem(item.id, item.product.name)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50"
                                                                disabled={loading}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center border border-gray-300 rounded">
                                                                <div className="flex items-center gap-2 mt-3">
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus size={16} />
                                                                    </button>
                                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                                    >
                                                                        <Plus size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-gray-900">
                                                                    Rs. {item.product ? (parseFloat(item.product.price) * item.quantity).toLocaleString() : 'N/A'}
                                                                </p>
                                                                {item.quantity > 1 && item.product && (
                                                                    <p className="text-gray-500 text-xs">
                                                                        Rs. {parseFloat(item.product.price).toLocaleString()} each
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="font-semibold text-gray-900">Order Summary</h2>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="space-y-3 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal ({totalItems} items)</span>
                                                <span>Rs. {totalPrice.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span className="text-green-600">Free</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tax (10%)</span>
                                                <span>Rs. 0</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount</span>
                                                    <span>- Rs. {discount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>
                                                    Rs. {grandTotal.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors mt-4"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showRemoveConfirm}
                onClose={() => setShowRemoveConfirm(false)}
                onConfirm={confirmRemoveItem}
                title="Remove Item from Cart"
                message={`Are you sure you want to remove "${selectedItemName}" from your cart?`}
                confirmText="Remove"
                cancelText="Keep Item"
                type="danger"
            />
        </>
    );
}

export default CartSection;
