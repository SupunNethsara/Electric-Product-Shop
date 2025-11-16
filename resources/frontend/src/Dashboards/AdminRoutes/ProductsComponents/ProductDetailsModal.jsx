import { X, Star, Package, Tag, Calendar, Eye, TrendingUp, Shield, ExternalLink } from "lucide-react";
import React, { useState } from "react";

export const ProductDetailsModal = ({ product, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);

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

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
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

                                {/* Rating Overview */}
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

                        {/* Description & Details */}
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
                    <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-end gap-3 ">
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
