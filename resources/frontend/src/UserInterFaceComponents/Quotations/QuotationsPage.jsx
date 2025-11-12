// components/Quotations/QuotationsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Trash2,
    ShoppingBag,
    FileText,
    Download
} from 'lucide-react';
import {
    fetchQuotations,
    removeFromQuotation,
    clearQuotations,
    clearQuotationError
} from '../../Store/slices/quotationSlice.js';
import useToast from '../Common/useToast.jsx';

const QuotationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const {
        items,
        loading,
        error,
        totalItems,
        totalPrice
    } = useSelector((state) => state.quotation);

    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchQuotations());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (error) {
            showError(error);
            dispatch(clearQuotationError());
        }
    }, [error, dispatch, showError]);

    const handleRemoveItem = async (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from quotations?')) {
            try {
                await dispatch(removeFromQuotation(itemId)).unwrap();
                success('Item removed from quotations');
            } catch (error) {
                showError(error || 'Failed to remove item');
            }
        }
    };

    const handleClearQuotations = async () => {
        if (window.confirm('Are you sure you want to clear all quotations?')) {
            try {
                await dispatch(clearQuotations()).unwrap();
                success('All quotations cleared');
            } catch (error) {
                showError(error || 'Failed to clear quotations');
            }
        }
    };

    const handleDownloadQuotation = () => {
        // Simple download as JSON for now
        const quotationData = {
            items: items,
            total: totalPrice,
            date: new Date().toLocaleDateString()
        };

        const dataStr = JSON.stringify(quotationData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotation-${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        success('Quotation downloaded successfully');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your quotations</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Quotations</h1>
                        <p className="text-gray-600 mt-2">
                            {totalItems} items • Total: Rs. {totalPrice.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                        {items.length > 0 && (
                            <>
                                <button
                                    onClick={handleDownloadQuotation}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download size={18} />
                                    Download Quotation
                                </button>

                                <button
                                    onClick={handleClearQuotations}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No quotations yet</h2>
                        <p className="text-gray-600 mb-6">Add products to your quotation list to see them here</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r bg-[#e3251b] text-white px-6 py-3 rounded-lg hover:from-[#9f1811]  transition-all"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                                    <h2 className="font-semibold text-gray-900 text-lg">Quotation Items</h2>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                        <img
                                                            src={item.product.image || '/placeholder-image.jpg'}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                                {item.product.name}
                                                            </h3>
                                                            <p className="text-gray-500 text-sm mb-1">
                                                                Model: {item.product.model}
                                                            </p>
                                                            <p className="text-blue-600 font-bold text-lg">
                                                                Rs. {parseFloat(item.product.price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium text-gray-700">Quantity: {item.quantity}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900 text-lg">
                                                                Rs. {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
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
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                                    <h2 className="font-semibold text-gray-900">Quotation Summary</h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({totalItems} items)</span>
                                            <span>Rs. {totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax (10%)</span>
                                            <span>Rs. {(totalPrice * 0.1).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                                            <span>Total</span>
                                            <span>Rs. {(totalPrice * 1.1).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <button
                                            onClick={handleDownloadQuotation}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
                                        >
                                            <Download size={18} />
                                            Download Quotation
                                        </button>

                                        <button
                                            onClick={() => navigate('/')}
                                            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                                        >
                                            <ShoppingBag size={18} />
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotationsPage;
