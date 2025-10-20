
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import ValidationResults from './ValidationResults';
import UploadProgress from './UploadProgress';
import CategorySelect from './CategorySelect';
import UploadComplete from "./UploadComplete.jsx";


const UploadProducts = ({ onUploadComplete }) => {
    const [uploadStage, setUploadStage] = useState('validate');
    const [files, setFiles] = useState({
        details: null,
        pricing: null
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/categories/active');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories');
            alert('Failed to load categories');
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleFileSelect = (type, file) => {
        setFiles(prev => ({
            ...prev,
            [type]: file
        }));
        setValidationResult(null);
    };

    const removeFile = (type) => {
        setFiles(prev => ({
            ...prev,
            [type]: null
        }));
    };

    const validateFiles = async () => {
        if (!files.details || !files.pricing) {
            alert('Please select both files');
            return;
        }

        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('details_file', files.details);
        formData.append('pricing_file', files.pricing);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/products/validate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setValidationResult(response.data);
            if (response.data.status === 'success') {
                setUploadStage('upload');
            }
        } catch (error) {
            if (error.response?.data) {
                setValidationResult(error.response.data);
            } else {
                alert('Validation failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const uploadProducts = async () => {
        if (!files.details || !files.pricing) {
            alert('Please select both files');
            return;
        }

        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('details_file', files.details);
        formData.append('pricing_file', files.pricing);
        formData.append('category_id', selectedCategory);

        try {
            await axios.post('http://127.0.0.1:8000/api/products/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setUploadProgress(progress);
                }
            });

            alert('Products uploaded successfully!');
            setUploadStage('complete');
            onUploadComplete();
        } catch (error) {
            if (error.response?.data) {
                alert('Upload failed: ' + JSON.stringify(error.response.data));
            } else {
                alert('Upload failed');
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const resetUpload = () => {
        setFiles({ details: null, pricing: null });
        setSelectedCategory('');
        setValidationResult(null);
        setUploadStage('validate');
        setUploadProgress(0);
    };

    const handleBackToValidation = () => {
        setUploadStage('validate');
    };

    return (
        <div className="space-y-6">
            {uploadStage === 'validate' && (
                <>
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Upload Product Files
                        </h2>
                        <p className="text-gray-600">
                            Upload both product details and pricing Excel files for validation
                        </p>
                    </div>

                    {/* Category Selection */}
                    <CategorySelect
                        categories={categories}
                        loading={categoriesLoading}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    <FileUpload
                        files={files}
                        onFileSelect={handleFileSelect}
                        onRemoveFile={removeFile}
                    />

                    <ValidationResults validationResult={validationResult} />

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={resetUpload}
                            className="text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={validateFiles}
                            disabled={loading || !files.details || !files.pricing || !selectedCategory || categoriesLoading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Validating...' : 'Validate Files'}
                        </button>
                    </div>
                </>
            )}

            {uploadStage === 'upload' && (
                <UploadProgress
                    uploadProgress={uploadProgress}
                    loading={loading}
                    selectedCategory={selectedCategory}
                    categories={categories}
                    onBack={handleBackToValidation}
                    onUpload={uploadProducts}
                />
            )}

            {uploadStage === 'complete' && (
                <UploadComplete
                    onReset={resetUpload}
                    onViewProducts={() => onUploadComplete()}
                />
            )}
        </div>
    );
};

export default UploadProducts;
