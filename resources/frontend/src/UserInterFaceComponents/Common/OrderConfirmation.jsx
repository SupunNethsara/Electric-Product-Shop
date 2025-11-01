import React from 'react';

function OrderConfirmation() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 mt-20 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg">Your order #00399 has been processed successfully</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                                <span className="text-sm text-gray-500">2 items</span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Apple Watch Series 7</h3>
                                        <p className="text-sm text-gray-500">Golden • 45mm</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Stock</span>
                                            <span className="text-sm text-gray-500">Qty: 1</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">$539</p>
                                        <p className="text-sm text-green-600">Free Shipping</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m-2.828-9.9a9 9 0 012.728-2.728" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Baylo 9D Speaker</h3>
                                        <p className="text-sm text-gray-500">Space Gray • Premium</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Stock</span>
                                            <span className="text-sm text-gray-500">Qty: 1</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">$49</p>
                                        <p className="text-sm text-green-600">Free Shipping</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">$588.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-red-600">-$11.00</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">$599.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Order Confirmed</p>
                                        <p className="text-sm text-gray-500">Just now</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Processing</p>
                                        <p className="text-sm text-gray-500">Expected: Today</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-400">Shipped</p>
                                        <p className="text-sm text-gray-400">Not started</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Shipping Address</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Wilson Asher<br />
                                        4517 Huntingdon Ave<br />
                                        Manchester, Kentucky 39427<br />
                                        USA
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#00ad42] to-green-600 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-2">Need Help?</h3>
                            <p className="text-blue-100 text-sm mb-4">Our support team is here to help with your order</p>
                            <button className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-200">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
