import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useToast from "../useToast.jsx";


function RecentOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState(null);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const token = localStorage.getItem('token');
    const { success, error: showError } = useToast();

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
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            setError(errorMessage);
            showError(errorMessage, 'Failed to Load Orders');
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

    const openReviewModal = (product) => {
        setSelectedProductForReview(product);
        setShowReviewModal(true);
    };

    const submitReview = async (reviewData) => {
        if (!selectedProductForReview) return;

        setReviewSubmitting(true);
        try {
           await axios.post(
                `http://127.0.0.1:8000/api/products/${selectedProductForReview.id}/reviews`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setOrders(prevOrders =>
                prevOrders.map(orderData => ({
                    ...orderData,
                    items: orderData.items.map(item =>
                        item.product?.id === selectedProductForReview.id
                            ? { ...item, has_reviewed: true }
                            : item
                    )
                }))
            );

            setShowReviewModal(false);
            setSelectedProductForReview(null);

            success('Review submitted successfully!', 'Thank You!');

        } catch (error) {
            console.error('Error submitting review:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Failed to submit review';
            showError(errorMessage, 'Review Failed');
        } finally {
            setReviewSubmitting(false);
        }
    };

   (product, orderStatus) => {
        return orderStatus === 'completed' && !product.has_reviewed;
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
           await axios.put(
                `http://127.0.0.1:8000/api/orders/${orderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(prevOrders =>
                prevOrders.map(orderData =>
                    orderData.order.id === orderId
                        ? {
                            ...orderData,
                            order: { ...orderData.order, status: 'cancelled' }
                        }
                        : orderData
                )
            );

            success('Order cancelled successfully!', 'Order Updated');
        } catch (error) {
            console.error('Error cancelling order:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Failed to cancel order';
            showError(errorMessage, 'Cancellation Failed');
        }
    };

    const ReviewModal = ({ product, onClose, onSubmit, submitting }) => {
        const [rating, setRating] = useState(5);
        const [title, setTitle] = useState('');
        const [comment, setComment] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (rating === 0) {
                showError('Please select a rating', 'Rating Required');
                return;
            }

            onSubmit({
                rating,
                title: title || null,
                comment: comment || null
            });
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Write a Review</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={submitting}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
                            <img
                                src={product?.image}
                                alt={product?.name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                }}
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">{product?.name}</h3>
                                <p className="text-sm text-gray-500">Model: {product?.model}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Rating *
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="text-2xl focus:outline-none transition-transform hover:scale-110"
                                            disabled={submitting}
                                        >
                                            {star <= rating ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{rating} out of 5 stars</p>
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Review Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Summarize your experience"
                                    maxLength={255}
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Review (Optional)
                                </label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors"
                                    placeholder="Share details of your experience with this product..."
                                    maxLength={1000}
                                    disabled={submitting}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {comment.length}/1000
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || rating === 0}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const OrderDetailsModal = ({ orderData, onClose, onReviewProduct }) => {
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
                                            {order.status === 'completed' && (
                                                <button
                                                    onClick={() => onReviewProduct(item.product)}
                                                    disabled={item.has_reviewed}
                                                    className={`mt-2 text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                                        item.has_reviewed
                                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                                >
                                                    {item.has_reviewed ? 'Reviewed' : 'Write Review'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

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
        <div className="min-h-screen bg-gray-50">
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

                                                {order.status === 'completed' && (
                                                    <button
                                                        className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded"
                                                        title="Review Products"
                                                        onClick={() => openOrderDetails(orderData)}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                        </svg>
                                                        <span>Review</span>
                                                    </button>
                                                )}
                                            </div>

                                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
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
                                                            <div className="text-right">
                                                                <span className="font-semibold text-gray-900 block">
                                                                    {formatCurrency(parseFloat(item.price))}
                                                                </span>
                                                                {order.status === 'completed' && (
                                                                    <button
                                                                        onClick={() => openReviewModal(item.product)}
                                                                        disabled={item.has_reviewed}
                                                                        className={`text-xs mt-1 px-2 py-1 rounded transition-colors ${
                                                                            item.has_reviewed
                                                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                                        }`}
                                                                    >
                                                                        {item.has_reviewed ? 'Reviewed' : 'Review'}
                                                                    </button>
                                                                )}
                                                            </div>
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
                        onReviewProduct={openReviewModal}
                    />
                )}

                {showReviewModal && (
                    <ReviewModal
                        product={selectedProductForReview}
                        onClose={() => {
                            setShowReviewModal(false);
                            setSelectedProductForReview(null);
                        }}
                        onSubmit={submitReview}
                        submitting={reviewSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

export default RecentOrders;
