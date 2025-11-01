import React from 'react';

function OrderConfirmation() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6 mt-20">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:scale-105">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                                <p className="text-gray-600">Your order #00399 has been processed</p>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">2 items</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">Apple Watch Series 7</h3>
                                        <p className="text-xs text-gray-500">Golden • 45mm</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">In Stock</span>
                                            <span className="text-xs text-gray-500">Qty: 1</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 text-sm">$539</p>
                                        <p className="text-xs text-green-600">Free Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 transition-all duration-200 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m-2.828-9.9a9 9 0 012.728-2.728" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">Baylo 9D Speaker</h3>
                                        <p className="text-xs text-gray-500">Space Gray • Premium</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">In Stock</span>
                                            <span className="text-xs text-gray-500">Qty: 1</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 text-sm">$49</p>
                                        <p className="text-xs text-green-600">Free Shipping</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3">Order Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 transition-all duration-200 hover:bg-gray-50 -mx-1 px-1 py-1 rounded">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">Order Confirmed</p>
                                        <p className="text-xs text-gray-500">Just now</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 transition-all duration-200 hover:bg-gray-50 -mx-1 px-1 py-1 rounded">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">Processing</p>
                                        <p className="text-xs text-gray-500">Expected: Today</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 transition-all duration-200 hover:bg-gray-50 -mx-1 px-1 py-1 rounded">
                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-400 text-sm">Shipped</p>
                                        <p className="text-xs text-gray-400">Not started</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3">Delivery Info</h3>
                            <div className="space-y-3">
                                <div className="transition-all duration-200 hover:bg-gray-50 -mx-1 px-1 py-1 rounded">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-xs font-medium text-gray-700">Shipping Address</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Wilson Asher<br />
                                        4517 Huntingdon Ave<br />
                                        Manchester, Kentucky 39427<br />
                                        USA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900 text-sm">$588.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Shipping</span>
                                    <span className="font-medium text-green-600 text-sm">Free</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900 text-sm">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Discount</span>
                                    <span className="font-medium text-red-600 text-sm">-$11.00</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 transition-all duration-300 hover:from-blue-50 hover:to-blue-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-gray-900 text-sm block">Total</span>
                                        <span className="text-xs text-gray-600">All charges included</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900">$599.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
