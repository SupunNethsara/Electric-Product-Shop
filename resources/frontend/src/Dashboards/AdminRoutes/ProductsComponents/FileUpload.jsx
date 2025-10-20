// FileUpload.js
import React from 'react';

const FileUpload = ({ files, onFileSelect, onRemoveFile }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadCard
                    type="details"
                    file={files.details}
                    title="Product Details File"
                    description="Contains: item_code, name, model, description"
                    onFileSelect={onFileSelect}
                    onRemoveFile={onRemoveFile}
                />
                <FileUploadCard
                    type="pricing"
                    file={files.pricing}
                    title="Product Pricing File"
                    description="Contains: item_code, price, availability"
                    onFileSelect={onFileSelect}
                    onRemoveFile={onRemoveFile}
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 font-medium mb-2">Expected File Formats:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h5 className="text-blue-700 font-medium">Details File (first row is header):</h5>
                        <p className="text-blue-600">item_code, name, model, description</p>
                    </div>
                    <div>
                        <h5 className="text-blue-700 font-medium">Pricing File (first row is header):</h5>
                        <p className="text-blue-600">item_code, price, availability</p>
                    </div>
                </div>
            </div>
        </>
    );
};

const FileUploadCard = ({ type, file, title, description, onFileSelect, onRemoveFile }) => {
    return (
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
            <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-2">
                {title}
            </p>
            <p className="text-xs text-gray-500 mb-4">
                {description}
            </p>
            {file ? (
                <div className="space-y-2">
                    <p className="text-sm text-green-700 font-medium">
                        {file.name}
                    </p>
                    <button
                        onClick={() => onRemoveFile(type)}
                        className="text-red-600 text-sm hover:text-red-800"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Select File
                    <input
                        type="file"
                        className="hidden"
                        accept=".xlsx,.csv"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                onFileSelect(type, e.target.files[0]);
                            }
                        }}
                    />
                </label>
            )}
        </div>
    );
};

export default FileUpload;
