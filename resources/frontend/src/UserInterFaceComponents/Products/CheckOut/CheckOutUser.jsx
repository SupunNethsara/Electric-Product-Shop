import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { openLoginModal } from "../../../Store/slices/modalSlice.js";
import {
    CreditCard,
    Truck,
    Shield,
    ArrowRight,
    Lock,
    CheckCircle2,
    MapPin,
    User,
    Phone,
    Mail
} from 'lucide-react';

function CheckOutUser() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cartItems = useSelector(state => state.cart?.items || []);

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [shippingMethod, setShippingMethod] = useState('standard');

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    const shippingMethods = [
        { id: 'standard', name: 'Standard Shipping', price: 0, duration: '5-7 business days' },
        { id: 'express', name: 'Express Shipping', price: 9.99, duration: '2-3 business days' },
        { id: 'priority', name: 'Priority Shipping', price: 19.99, duration: '1 business day' }
    ];

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
        { id: 'paypal', name: 'PayPal', icon: Shield },
        { id: 'cod', name: 'Cash on Delivery', icon: Truck }
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMethods.find(method => method.id === shippingMethod)?.price || 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    if (!isAuthenticated) {
        dispatch(openLoginModal('/checkout'));
        return <Navigate to="/" replace />;
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Order placed:', { formData, paymentMethod, shippingMethod, cartItems });
        }
    };

    const steps = [
        { number: 1, title: 'Shipping', icon: MapPin },
        { number: 2, title: 'Payment', icon: CreditCard },
        { number: 3, title: 'Review', icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your purchase securely</p>
                </div>

                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step.number
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'border-gray-300 text-gray-500'
                                }`}>
                                    {currentStep > step.number ? (
                                        <CheckCircle2 size={20} />
                                    ) : (
                                        <step.icon size={20} />
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-4 ${
                                        currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        {steps.map(step => (
                            <span
                                key={step.number}
                                className={`text-sm font-medium ${
                                    currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                                }`}
                            >
                                {step.title}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                {currentStep === 1 && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                            <User size={20} />
                                            Shipping Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shipping Address
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Street address"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Phone size={16} />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                            <CreditCard size={20} />
                                            Payment Method
                                        </h2>

                                        <div className="space-y-4 mb-6">
                                            {paymentMethods.map(method => (
                                                <div
                                                    key={method.id}
                                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                                        paymentMethod === method.id
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            paymentMethod === method.id
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            <method.icon size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900">{method.name}</h3>
                                                        </div>
                                                        {paymentMethod === method.id && (
                                                            <CheckCircle2 className="text-green-600" size={20} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                                <h3 className="font-medium text-gray-900 mb-4">Card Details</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Card Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="1234 5678 9012 3456"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Expiry Date
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="MM/YY"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                CVV
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="123"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                            <CheckCircle2 size={20} />
                                            Review Your Order
                                        </h2>

                                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                            <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
                                            <div className="space-y-3">
                                                {cartItems.map(item => (
                                                    <div key={item.id} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-medium text-gray-900">
                                                            Rs. {(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                            <h3 className="font-medium text-green-900 mb-3">Almost there!</h3>
                                            <p className="text-green-700 text-sm">
                                                Review your order details and click "Place Order" to complete your purchase.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    <div className="flex justify-between">
                                        {currentStep > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                Back
                                            </button>
                                        ) : (
                                            <div></div>
                                        )}
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                                        >
                                            {currentStep === 3 ? (
                                                <>
                                                    <Lock size={16} />
                                                    Place Order
                                                </>
                                            ) : (
                                                <>
                                                    Continue
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                {cartItems.slice(0, 3).map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Rs. {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                {cartItems.length > 3 && (
                                    <p className="text-sm text-gray-600 text-center">
                                        +{cartItems.length - 3} more items
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">Rs. {shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">Rs. {tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-4 mb-6">
                                <span className="text-gray-900">Total</span>
                                <span className="text-green-600">Rs. {total.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                                <Shield size={14} className="text-green-600" />
                                <span>Your payment is secure and encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckOutUser;
