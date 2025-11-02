import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecentOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/orders/getUserOrders',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            completed: 'bg-green-100 text-green-800 border border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            processing: 'bg-blue-100 text-blue-800 border border-blue-200',
            cancelled: 'bg-red-100 text-red-800 border border-red-200',
            shipped: 'bg-purple-100 text-purple-800 border border-purple-200'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const openOrderDetails = (orderData) => {
        setSelectedOrder(orderData);
        setShowDetailsModal(true);
    };

    const OrderDetailsModal = ({ orderData, onClose }) => {
        if (!orderData) return null;

        const order = orderData.order;
        const items = orderData.items || [];
        const user = orderData.user;
        const profile = orderData.profile;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Order Summary */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                                <p><span className="text-gray-600">Order Code:</span> {order.order_code}</p>
                                <p><span className="text-gray-600">Placed:</span> {formatDate(order.created_at)}</p>
                                <p><span className="text-gray-600">Status:</span> {getStatusBadge(order.status)}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Payment & Delivery</h3>
                                <p><span className="text-gray-600">Payment:</span> {order.payment_method.replace(/_/g, ' ').toUpperCase()}</p>
                                <p><span className="text-gray-600">Delivery:</span> {order.delivery_option.replace(/_/g, ' ').toUpperCase()}</p>
                                <p><span className="text-gray-600">Delivery Fee:</span> {formatCurrency(parseFloat(order.delivery_fee))}</p>
                            </div>
                        </div>

                        {/* Customer Information */}
                        {user && profile && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><span className="text-gray-600">Name:</span> {user.name}</p>
                                        <p><span className="text-gray-600">Email:</span> {user.email}</p>
                                        <p><span className="text-gray-600">Phone:</span> {profile.phone}</p>
                                    </div>
                                    <div>
                                        <p><span className="text-gray-600">Address:</span> {profile.address}</p>
                                        <p><span className="text-gray-600">City:</span> {profile.city}</p>
                                        <p><span className="text-gray-600">Country:</span> {profile.country}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Order Items ({items.length})</h3>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.name}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{item.product?.name}</p>
                                                <p className="text-sm text-gray-500">Model: {item.product?.model}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatCurrency(parseFloat(item.price))}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(parseFloat(order.total_amount))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchUserOrders}
                            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-full mx-auto px-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((orderData) => {
                            const order = orderData.order;
                            const items = orderData.items || [];
                            const totalItems = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);

                            return (
                                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm">
                                                        Order #{order.order_code}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(order.created_at)} • {totalItems} item{totalItems !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatCurrency(parseFloat(order.total_amount))}
                                                </span>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openOrderDetails(orderData)}
                                                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded"
                                                    title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Details</span>
                                                </button>

                                                <button
                                                    onClick={() => toggleOrderExpand(order.id)}
                                                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded"
                                                    title="View Items"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                    <span>Items</span>
                                                </button>

                                                <button className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded"
                                                        title="Track Order">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                    <span>Track</span>
                                                </button>
                                            </div>

                                            <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium">
                                              Cancel
                                            </button>
                                        </div>

                                        {expandedOrder === order.id && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="space-y-3">
                                                    {items.map((item) => (
                                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={item.product?.image}
                                                                    alt={item.product?.name}
                                                                    className="w-8 h-8 object-cover rounded"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                                    }}
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <span className="font-semibold text-gray-900">
                                                                {formatCurrency(parseFloat(item.price))}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showDetailsModal && (
                    <OrderDetailsModal
                        orderData={selectedOrder}
                        onClose={() => setShowDetailsModal(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default RecentOrders;
