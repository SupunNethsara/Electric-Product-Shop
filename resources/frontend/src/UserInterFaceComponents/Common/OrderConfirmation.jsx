import React from "react";
import { useLocation } from "react-router-dom";

function OrderConfirmation() {
    const location = useLocation();
    const { order, user, orderSummary, items, deliveryOption } =
        location.state || {};

    if (!order || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Order Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Unable to load order details.
                    </p>
                    <button
                        onClick={() => (window.location.href = "/products")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-10 h-10 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Order Confirmed!
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Your order #{order.order_number || order.id}{" "}
                                    has been processed successfully
                                </p>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Order Items
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {orderSummary.itemCount}{" "}
                                    {orderSummary.itemCount === 1
                                        ? "item"
                                        : "items"}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => {
                                    const images =
                                        typeof item.product?.images === "string"
                                            ? JSON.parse(
                                                  item.product.images.replace(
                                                      /\\([^\\])/g,
                                                      "$1",
                                                  ),
                                              )
                                            : item.product?.images || [];
                                    const mainImage =
                                        images[0] || item.product?.image;

                                    return (
                                        <div
                                            key={item.id || index}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                                        >
                                            {mainImage ? (
                                                <img
                                                    src={mainImage}
                                                    alt={
                                                        item.product?.name ||
                                                        "Product"
                                                    }
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-base mb-1">
                                                    {item.product?.name ||
                                                        "Product"}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>
                                                        Qty: {item.quantity}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Rs.{" "}
                                                        {item.product?.price
                                                            ? parseFloat(
                                                                  item.product
                                                                      .price,
                                                              ).toFixed(2)
                                                            : "0.00"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900 text-lg">
                                                    Rs.{" "}
                                                    {(
                                                        parseFloat(
                                                            item.product
                                                                ?.price || 0,
                                                        ) * item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-green-600 mt-1">
                                                    In Stock
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Order Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">
                                        Items Total ({orderSummary.itemCount}{" "}
                                        items)
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        Rs. {orderSummary.itemsTotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">
                                        Delivery Fee
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        Rs.{" "}
                                        {orderSummary.deliveryFee.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">
                                        Rs. 0.00
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">
                                        Discount
                                    </span>
                                    <span className="font-medium text-red-600">
                                        -Rs. 0.00
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            Total Amount
                                        </span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            Rs. {orderSummary.total.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 text-right mt-1">
                                        All charges included
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Order Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            Order Confirmed
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Your order has been confirmed and is
                                            being processed
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Just now
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            Processing
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            We're preparing your items for
                                            shipment
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Expected: Today
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-400">
                                            Shipped
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Your order is on its way
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Not started
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Customer Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-4 h-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            Contact Details
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                        <p>{user.email}</p>
                                        <p>
                                            {user.profile?.phone ||
                                                "Phone not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-4 h-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            Shipping Address
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            {user.profile?.address ||
                                                "Address not provided"}
                                        </p>
                                        <p>
                                            {user.profile?.city &&
                                                `${user.profile.city}, `}
                                            {user.profile?.postal_code &&
                                                `${user.profile.postal_code}, `}
                                            {user.profile?.country || ""}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-4 h-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            Delivery Information
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">
                                            {deliveryOption?.name ||
                                                "Standard Delivery"}
                                        </p>
                                        <p>
                                            {deliveryOption?.deliveryTime ||
                                                "3-5 business days"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                        onClick={() => window.print()}
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Print Receipt
                    </button>
                    <button
                        onClick={() => (window.location.href = "/shop")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
