import React from 'react';
import dayjs from 'dayjs';

const OrderViewModal = ({ isOpen, onClose, orderData }) => {
    if (!isOpen || !orderData) return null;

    const { order, items } = orderData;

    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
            case "contacted": return "bg-blue-50 text-blue-700 border-blue-200";
            case "completed": return "bg-green-50 text-green-700 border-green-200";
            case "cancelled": return "bg-red-50 text-red-700 border-red-200";
            case "processing": return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "shipped": return "bg-purple-50 text-purple-700 border-purple-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const statusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>;
            case "completed":
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>;
            case "cancelled":
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>;
            case "processing":
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>;
            case "shipped":
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>;
            default:
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>;
        }
    };

    const parseImages = (imagesString) => {
        try {
            if (typeof imagesString === 'string') {
                return JSON.parse(imagesString.replace(/\\/g, ''));
            }
            return imagesString || [];
        } catch (error) {
            return [];
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                            <p className="text-sm text-gray-500 mt-1">Order #{order.order_code}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Order Date</p>
                                                <p className="font-medium text-gray-900">
                                                    {dayjs(order.created_at).format("MMM D, YYYY h:mm A")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Payment Method</p>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {order.payment_method?.replace(/_/g, ' ') || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Delivery Option</p>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {order.delivery_option || 'Standard'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Delivery Fee</p>
                                                <p className="font-medium text-gray-900">
                                                    Rs. {parseFloat(order.delivery_fee || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 mb-3">Order Status</h3>
                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${statusColor(order.status)}`}>
                                            {statusIcon(order.status)}
                                            <span className="font-medium capitalize">{order.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Amount Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Items Total:</span>
                                            <span className="font-medium">
                                                Rs. {(parseFloat(order.total_amount) - parseFloat(order.delivery_fee || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Fee:</span>
                                            <span className="font-medium">
                                                Rs. {parseFloat(order.delivery_fee || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2 mt-2">
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total Amount:</span>
                                                <span className="text-green-600">
                                                    Rs. {parseFloat(order.total_amount || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">Order Items ({items?.length || 0})</h3>
                                <div className="space-y-3">
                                    {items?.map((item) => {
                                        const images = parseImages(item.product?.images);
                                        const mainImage = images[0] || item.product?.image;

                                        return (
                                            <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                                                {mainImage ? (
                                                    <img
                                                        src={mainImage}
                                                        alt={item.product?.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        {item.product?.name || 'Product'}
                                                    </h4>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Model: {item.product?.model || 'N/A'}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        Item Code: {item.product?.item_code || 'N/A'}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        Rs. {parseFloat(item.price || 0).toLocaleString()}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="font-medium text-green-600 text-sm mt-1">
                                                        Rs. {(parseFloat(item.price || 0) * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {items?.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        Product Details: {item.product?.name}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Description</p>
                                            <p className="text-gray-900 mt-1">
                                                {item.product?.description || 'No description available'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Availability</p>
                                            <p className="text-gray-900 mt-1">
                                                {item.product?.availability || 0} in stock
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end gap-3 p-6">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Close
                            </button>
                            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderViewModal;
