
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
    Trash2,
    ShoppingBag,
    FileText,
    Download,
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

    const generateQuotationPDF = () => {
        const doc = new jsPDF();

        doc.setFillColor(227, 37, 27);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('QUOTATION', 105, 18, { align: 'center' });

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Your Company Name', 15, 40);
        doc.text('123 Business Street', 15, 45);
        doc.text('City, State 12345', 15, 50);
        doc.text('Phone: +1 234 567 8900', 15, 55);

        const quotationDate = new Date().toLocaleDateString();
        const quotationNo = `QT-${Date.now()}`;

        doc.text(`Quotation No: ${quotationNo}`, 150, 40);
        doc.text(`Date: ${quotationDate}`, 150, 45);
        doc.text(`Customer: Logged-in User`, 150, 50);

        doc.setFillColor(240, 240, 240);
        doc.rect(15, 70, 180, 10, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Item', 20, 77);
        doc.text('Model', 70, 77);
        doc.text('Price', 120, 77);
        doc.text('Qty', 150, 77);
        doc.text('Amount', 170, 77);

        let yPosition = 85;
        doc.setFont('helvetica', 'normal');

        items.forEach((item, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }

            const itemTotal = parseFloat(item.product.price) * item.quantity;

            doc.text(item.product.name.substring(0, 30), 20, yPosition);
            doc.text(item.product.model, 70, yPosition);
            doc.text(`Rs. ${parseFloat(item.product.price).toLocaleString()}`, 120, yPosition);
            doc.text(item.quantity.toString(), 150, yPosition);
            doc.text(`Rs. ${itemTotal.toLocaleString()}`, 170, yPosition);

            yPosition += 8;
        });

        const tax = totalPrice * 0.1;
        const grandTotal = totalPrice + tax;

        yPosition = Math.max(yPosition + 10, 260);
        doc.setFont('helvetica', 'bold');
        doc.text('Subtotal:', 140, yPosition);
        doc.text(`Rs. ${totalPrice.toLocaleString()}`, 170, yPosition);

        doc.text('Tax (10%):', 140, yPosition + 5);
        doc.text(`Rs. ${tax.toLocaleString()}`, 170, yPosition + 5);

        doc.setFontSize(11);
        doc.text('Grand Total:', 140, yPosition + 12);
        doc.text(`Rs. ${grandTotal.toLocaleString()}`, 170, yPosition + 12);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for your business! This quotation is valid for 30 days.', 105, 280, { align: 'center' });
        doc.text('Terms & Conditions: Prices are subject to change without prior notice.', 105, 285, { align: 'center' });

        doc.save(`quotation-${quotationNo}.pdf`);
        success('Quotation PDF downloaded successfully');
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
                        <h1 className="text-2xl font-bold text-gray-900">Quotation Management</h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            {totalItems} items • Total: Rs. {totalPrice.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                        {items.length > 0 && (
                            <>
                                <button
                                    onClick={generateQuotationPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </button>

                                <button
                                    onClick={handleClearQuotations}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    <Trash2 size={16} />
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No quotations yet</h2>
                        <p className="text-gray-600 mb-4 text-sm">Add products to your quotation list to see them here</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-[#e3251b] text-white px-5 py-2 rounded-lg hover:bg-[#9f1811] transition-colors text-sm"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <h2 className="font-semibold text-gray-900 text-base">Quotation Items</h2>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex gap-3 items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                                        <img
                                                            src={item.product.image || '/placeholder-image.jpg'}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                                                                {item.product.name}
                                                            </h3>
                                                            <p className="text-gray-500 text-xs mb-1">
                                                                Model: {item.product.model}
                                                            </p>
                                                            <p className="text-blue-600 font-semibold text-sm">
                                                                Rs. {parseFloat(item.product.price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-600 font-medium">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900 text-sm">
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
                            <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <h2 className="font-semibold text-gray-900 text-base">Summary</h2>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal ({totalItems} items)</span>
                                            <span>Rs. {totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Tax (10%)</span>
                                            <span>Rs. {(totalPrice * 0.1).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                                            <span>Total</span>
                                            <span>Rs. {(totalPrice * 1.1).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <button
                                            onClick={generateQuotationPDF}
                                            className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            <Download size={16} />
                                            Download PDF
                                        </button>

                                        <button
                                            onClick={() => navigate('/')}
                                            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                        >
                                            <ShoppingBag size={16} />
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
