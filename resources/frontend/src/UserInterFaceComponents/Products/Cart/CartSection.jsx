import React from 'react';
import { Trash2, Plus, Minus, MapPin, CreditCard, Tag } from 'lucide-react';

function CartSection() {
    const cartItems = [
        {
            id: 1,
            name: 'Wireless Headphones',
            model: 'WH-1000XM4',
            price: '15,999',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&auto=format&q=80',
            quantity: 1
        },
        {
            id: 2,
            name: 'Smartphone',
            model: 'Galaxy S21',
            price: '69,999',
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop&auto=format&q=80',
            quantity: 2
        }
    ];

    const selectedAddress = {
        name: 'John Doe',
        address: '123 Main St, Apartment 4B',
        city: 'New York',
        postal_code: '10001'
    };

    const paymentMethod = 'cod';
    const couponCode = '';
    const discount = 0;
    const subtotal = 155998;
    const shippingFee = 0;
    const tax = 15599.8;
    const grandTotal = 171597.8;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-500 text-sm mt-1">{cartItems.length} items</p>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                        Continue Shopping
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-5 py-3 border-b border-gray-200">
                                <h2 className="font-medium text-gray-900">Cart Items</h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h3>
                                                        <p className="text-gray-500 text-xs mb-1">{item.model}</p>
                                                        <p className="text-green-600 font-semibold text-sm">Rs. {item.price}</p>
                                                    </div>
                                                    <button className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center border border-gray-300 rounded">
                                                        <button className="p-1 text-gray-600 hover:text-gray-900">
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="px-2 py-1 border-x border-gray-300 min-w-8 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button className="p-1 text-gray-600 hover:text-gray-900">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            Rs. {(parseInt(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}
                                                        </p>
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
                            <div className="px-5 py-3 border-b border-gray-200">
                                <h2 className="font-medium text-gray-900">Order Summary</h2>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                                        <MapPin size={16} className="text-green-600" />
                                        Delivery Address
                                    </h3>
                                    <div className="bg-green-50 border border-green-200 rounded p-3">
                                        <p className="font-medium text-green-900 text-sm">{selectedAddress.name}</p>
                                        <p className="text-green-700 text-xs mt-1">{selectedAddress.address}</p>
                                        <p className="text-green-700 text-xs">{selectedAddress.city}, {selectedAddress.postal_code}</p>
                                        <button className="text-green-600 text-xs mt-2 hover:text-green-700 font-medium">
                                            Change Address
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                                        <CreditCard size={16} className="text-green-600" />
                                        Payment Method
                                    </h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 p-2 border border-gray-300 rounded text-sm cursor-pointer hover:bg-green-50">
                                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} readOnly className="text-green-600" />
                                            <span className="font-medium">Cash on Delivery</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-2 border border-gray-300 rounded text-sm cursor-pointer hover:bg-green-50">
                                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} readOnly className="text-green-600" />
                                            <span className="font-medium">Credit/Debit Card</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                                        <Tag size={16} className="text-green-600" />
                                        Coupon Code
                                    </h3>
                                    <div className="flex gap-2">
                                        <input type="text" value={couponCode} readOnly placeholder="Enter coupon" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
                                        <button className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax</span>
                                        <span>Rs. {tax.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 text-sm">
                                            <span>Discount</span>
                                            <span>- Rs. {discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>Rs. {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-sm transition-colors mt-3">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartSection;
