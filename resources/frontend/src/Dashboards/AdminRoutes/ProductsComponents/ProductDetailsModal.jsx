import { X, Star, Package, Tag, Calendar, Eye, TrendingUp, Shield, Download } from "lucide-react";
import React, { useState } from "react";

export const ProductDetailsModal = ({ product, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [generatingPDF, setGeneratingPDF] = useState(false);
console.log(product)
    const parseImages = (imagesData) => {
        if (!imagesData) return [];
        try {
            if (typeof imagesData === 'string') {
                const cleanedString = imagesData.replace(/\\/g, '');
                return JSON.parse(cleanedString);
            } else if (Array.isArray(imagesData)) {
                return imagesData;
            }
        } catch (error) {
            console.error('Error parsing images:', error);
            return []
        }
        return [];
    };

    const productImages = parseImages(product.images);
    const mainImage = product.image || (productImages.length > 0 ? productImages[0] : null);
    const displayImage = selectedImage || mainImage;
    const allImages = [mainImage, ...productImages].filter(Boolean);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    const generatePDF = async () => {
        setGeneratingPDF(true);
        try {
            const { jsPDF } = await import('jspdf');
         (await import('html2canvas')).default;

            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPosition = 20;

            doc.setFillColor(37, 99, 235);
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('PRODUCT CATALOG', pageWidth / 2, 20, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });

            yPosition = 50;
            doc.setTextColor(0, 0, 0);

            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text(product.name, 15, yPosition);
            yPosition += 10;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Item Code: ${product.item_code} | Model: ${product.model}`, 15, yPosition);
            yPosition += 15;

            doc.setFillColor(220, 252, 231);
            doc.rect(15, yPosition - 5, pageWidth - 30, 25, 'F');
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('PRICING', 20, yPosition + 3);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.text(`Regular Price: Rs. ${parseFloat(product.price).toLocaleString()}`, 20, yPosition + 10);
            doc.setTextColor(22, 163, 74);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Buy Now: Rs. ${parseFloat(product.buy_now_price).toLocaleString()}`, 20, yPosition + 18);
            doc.setTextColor(0, 0, 0);
            const discount = (((product.price - product.buy_now_price) / product.price) * 100).toFixed(1);
            doc.setFontSize(10);
            doc.text(`Save ${discount}%`, 120, yPosition + 18);
            yPosition += 35;

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('PRODUCT INFORMATION', 15, yPosition);
            yPosition += 7;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);

            const info = [
                [`Brand: ${product.category_2 || 'N/A'}`, `Type: ${product.category_3 || 'N/A'}`],
                [`Stock: ${product.availability} units`, `Status: ${product.status}`],
                [`Warranty: ${product.warranty || 'No warranty'}`, `Views: ${product.total_views}`]
            ];

            info.forEach(row => {
                doc.text(row[0], 20, yPosition);
                doc.text(row[1], 110, yPosition);
                yPosition += 6;
            });
            yPosition += 5;

            doc.setFillColor(254, 243, 199);
            doc.rect(15, yPosition - 5, pageWidth - 30, 30, 'F');
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('RATINGS & REVIEWS', 20, yPosition + 3);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Average Rating: ${product.average_rating || 0}/5`, 20, yPosition + 11);
            doc.text(`Total Reviews: ${product.reviews_count || 0}`, 20, yPosition + 18);

            let barX = 80;
            [5, 4, 3, 2, 1].forEach((star, idx) => {
                const count = product.rating_distribution?.[star] || 0;
                const total = product.reviews_count || 1;
                const percentage = (count / total) * 100;

                doc.setFontSize(8);
                doc.text(`${star}★`, barX, yPosition + 11 + (idx * 4));
                doc.setFillColor(229, 231, 235);
                doc.rect(barX + 8, yPosition + 8 + (idx * 4), 30, 2, 'F');
                doc.setFillColor(251, 191, 36);
                doc.rect(barX + 8, yPosition + 8 + (idx * 4), (30 * percentage) / 100, 2, 'F');
                doc.setFontSize(7);
                doc.text(`${count}`, barX + 40, yPosition + 11 + (idx * 4));
            });
            yPosition += 40;

            if (product.hedding || product.description) {
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('DESCRIPTION', 15, yPosition);
                yPosition += 7;
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');

                if (product.hedding) {
                    const headingLines = doc.splitTextToSize(product.hedding, pageWidth - 30);
                    doc.text(headingLines, 20, yPosition);
                    yPosition += headingLines.length * 5;
                }

                if (product.description) {
                    const descLines = doc.splitTextToSize(product.description, pageWidth - 30);
                    doc.text(descLines, 20, yPosition);
                    yPosition += descLines.length * 5 + 5;
                }
            }

            if (yPosition > pageHeight - 60) {
                doc.addPage();
                yPosition = 20;
            }

            if (product.specification) {
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('SPECIFICATIONS', 15, yPosition);
                yPosition += 7;
                doc.setFontSize(8);
                doc.setFont(undefined, 'normal');
                const specLines = doc.splitTextToSize(product.specification, pageWidth - 30);
                const maxLines = Math.min(specLines.length, 20); // Limit lines
                doc.text(specLines.slice(0, maxLines), 20, yPosition);
                yPosition += maxLines * 4 + 5;
            }

            if (product.tags && product.tags.trim()) {
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('TAGS', 15, yPosition);
                yPosition += 7;
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                const tags = product.tags.split(',').map(t => t.trim()).filter(Boolean).join(', ');
                const tagLines = doc.splitTextToSize(tags, pageWidth - 30);
                doc.text(tagLines, 20, yPosition);
                yPosition += tagLines.length * 5 + 10;
            }

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                doc.text(`Product ID: ${product.id}`, 15, pageHeight - 10);
            }

            doc.save(`${product.item_code}-${product.name.replace(/[^a-z0-9]/gi, '-')}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="pr-12">
                        <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
                            <Package className="w-4 h-4" />
                            <span>{product.item_code}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
                        <p className="text-blue-100">{product.model}</p>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                    <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                {displayImage ? (
                                    <>
                                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group">
                                            <img
                                                src={displayImage}
                                                alt={product.name}
                                                className="w-full h-96 object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                                }}
                                            />
                                        </div>
                                        {allImages.length > 1 && (
                                            <div className="grid grid-cols-5 gap-2">
                                                {allImages.map((img, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedImage(img)}
                                                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                                            img === displayImage
                                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                                : 'border-gray-200 hover:border-blue-300'
                                                        }`}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`${product.name} ${index + 1}`}
                                                            className="w-full h-20 object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/100?text=Error';
                                                            }}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-96 flex flex-col items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-400 mb-4" />
                                        <p className="text-gray-500 font-medium">No images available</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-3xl font-bold text-green-700">
                                            Rs. {parseFloat(product.buy_now_price).toLocaleString()}
                                        </span>
                                        <span className="text-lg text-gray-500 line-through">
                                            Rs. {parseFloat(product.price).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                                            product.availability > 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {product.availability > 0 ? '✓' : '✗'} {product.availability} in stock
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                                            product.status === 'active'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="text-4xl font-bold text-amber-600">
                                            {product.average_rating || 0}
                                        </div>
                                        <div>
                                            <div className="flex gap-1 mb-1">
                                                {renderStars(product.average_rating || 0)}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {product.reviews_count || 0} reviews
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = product.rating_distribution?.[star] || 0;
                                            const total = product.reviews_count || 1;
                                            const percentage = (count / total) * 100;
                                            return (
                                                <div key={star} className="flex items-center gap-2 text-sm">
                                                    <span className="w-12 text-gray-600">{star} star</span>
                                                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-400"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-12 text-right text-gray-600">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <Tag className="w-5 h-5 text-blue-600 mb-2" />
                                        <p className="text-xs text-blue-600 mb-1">Brand</p>
                                        <p className="font-semibold text-blue-900">
                                            {product.category_2 || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                        <Package className="w-5 h-5 text-purple-600 mb-2" />
                                        <p className="text-xs text-purple-600 mb-1">Type</p>
                                        <p className="font-semibold text-purple-900">
                                            {product.category_3 || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 col-span-2">
                                        <Shield className="w-5 h-5 text-orange-600 mb-2" />
                                        <p className="text-xs text-orange-600 mb-1">Warranty</p>
                                        <p className="font-semibold text-orange-900">
                                            {product.warranty || 'No warranty'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {product.hedding && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Heading</h3>
                                    <p className="text-gray-700 leading-relaxed">{product.hedding}</p>
                                </div>
                            )}

                            {product.description && (
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {product.specification && (
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
                                        {product.specification}
                                    </pre>
                                </div>
                            )}

                            {product.tags && product.tags.trim() && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.split(',').map((tag, index) => (
                                            tag.trim() && (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {tag.trim()}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <Eye className="w-5 h-5 text-blue-600 mb-2" />
                                    <p className="text-xs text-gray-600 mb-1">Total Views</p>
                                    <p className="text-xl font-bold text-gray-900">{product.total_views}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <Calendar className="w-5 h-5 text-green-600 mb-2" />
                                    <p className="text-xs text-gray-600 mb-1">Created</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
                                    <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(product.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-end gap-3">
                        <button
                            onClick={generatePDF}
                            disabled={generatingPDF}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {generatingPDF ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
