import React, { useState } from 'react';

const ProductRow = ({ product, onImagesUpload }) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 4) {
            alert('You can only upload up to 4 images!');
            event.target.value = '';
            return;
        }
        setSelectedFiles(files);
        setMainImageIndex(0);
        setShowImageModal(true);
        event.target.value = '';
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert('Please select at least one image!');
            return;
        }

        setUploading(true);
        try {
            await onImagesUpload(product.id, product.item_code, selectedFiles, mainImageIndex);
            setShowImageModal(false);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const productImages = product.images
        ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images)
        : product.image ? [product.image] : [];

    const mainImage = product.image || (productImages.length > 0 ? productImages[0] : null);

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                        {productImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} view ${index + 1}`}
                                className="h-8 w-8 object-cover rounded border border-gray-200"
                            />
                        ))}
                        {productImages.length === 0 && (
                            <span className="text-gray-400 text-xs">No images</span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.item_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.model}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.availability > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {product.availability} in stock
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add Photos
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </label>
                </td>
            </tr>

            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Upload Product Images</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Selected {selectedFiles.length} of 3 images maximum.
                                <span className="font-medium"> First image will be set as main by default.</span>
                            </p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="h-20 w-full object-cover rounded border-2 border-gray-300"
                                        />
                                        <button
                                            onClick={() => setMainImageIndex(index)}
                                            className={`absolute top-1 left-1 text-xs px-1 rounded ${
                                                mainImageIndex === index
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-800 text-white bg-opacity-70'
                                            }`}
                                        >
                                            {mainImageIndex === index ? 'Main' : 'Set Main'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowImageModal(false);
                                    setSelectedFiles([]);
                                }}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading || selectedFiles.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image(s)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductRow;
