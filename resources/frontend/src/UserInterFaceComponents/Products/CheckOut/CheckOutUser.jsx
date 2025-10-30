import React, { useState } from "react";

function CheckOutUser() {
    const [storeCode, setStoreCode] = useState("");
    const [deliveryOption, setDeliveryOption] = useState("standard");

    // Sample data
    const orderData = {
        customer: {
            name: "K.Supun Nethsara Dharmaithaka",
            phone: "0762185219",
            address: "C/57/A Udaderiya.zhurunheila.mbulana, Ruwamvelia, Keşaila, Sabaragamuna"
        },
        items: [
            {
                id: 1,
                name: "Wigaya Chili Powder 100g, Wigya",
                originalPrice: 180,
                salePrice: 129,
                discount: 14,
                quantity: 1
            }
        ],
        deliveryOptions: [
            {
                id: "standard",
                name: "Standard",
                price: 308,
                deliveryTime: "Get by 31 Oct - 2 Nov"
            }
        ],
        summary: {
            itemsTotal: 129,
            deliveryFee: 308,
            total: 437
        }
    };

    const handleApplyStoreCode = () => {
        console.log("Applying store code:", storeCode);
    };

    const handleProceedToPay = () => {
        console.log("Proceeding to payment");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-20 px-4 sm:px-6 lg:px-8 ">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Shipping & Billing</h2>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-800 font-medium">{orderData.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">{orderData.customer.phone}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-600 text-sm">{orderData.customer.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-semibold text-gray-900">Package 1 of 1</h3>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                EDIT
                            </button>
                        </div>
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Option</h4>
                            <div className="flex flex-col gap-3">
                                {orderData.deliveryOptions.map(option => (
                                    <div key={option.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id={option.id}
                                                name="deliveryOption"
                                                checked={deliveryOption === option.id}
                                                onChange={() => setDeliveryOption(option.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <label htmlFor={option.id} className="text-sm font-medium text-gray-700">
                                                    <span className="font-semibold">Rs. {option.price}</span>
                                                    <span className="ml-2">{option.name}</span>
                                                </label>
                                                <span className="text-xs text-gray-500 mt-1">{option.deliveryTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {orderData.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-semibold text-gray-900">Rs. {item.salePrice}</span>
                                            <span className="text-sm text-gray-500 line-through">Rs. {item.originalPrice}</span>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">-{item.discount}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">Invoice and Contact Info</h4>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:w-96 flex flex-col gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Items Total ({orderData.items.length} Items)</span>
                                <span className="text-gray-900 font-medium">Rs. {orderData.summary.itemsTotal}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="text-gray-900 font-medium">Rs. {orderData.summary.deliveryFee}</span>
                            </div>

                            <div className="border-t border-gray-200 pt-3 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-lg font-semibold text-gray-900">Rs. {orderData.summary.total}</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-2">VAT Included, where applicable</p>
                        </div>

                        <button
                            onClick={handleProceedToPay}
                            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Proceed to Pay
                        </button>

                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Enter Store/Duraz Code</h4>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={storeCode}
                                    onChange={(e) => setStoreCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button
                                onClick={handleApplyStoreCode}
                                className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckOutUser;
