import ProductCard from "../Products/ProductCard.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, Search } from 'lucide-react';
import {Link} from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        const getProductHome = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://127.0.0.1:8000/api/products/home");
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        getProductHome();
    }, []);

    useEffect(() => {
        let result = products;

        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortBy) {
            case 'price_low':
                result = [...result].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price_high':
                result = [...result].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'name':
                result = [...result].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                break;
        }

        setFilteredProducts(result);
    }, [searchTerm, sortBy, products]);

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="max-w-10/12 mx-auto py-8 px-4">
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                            <option value="featured">Featured</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => {
                                    const inStockProducts = products.filter(p => p.availability > 0 && p.status !== 'disabled');
                                    setFilteredProducts(inStockProducts);
                                }}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                In Stock
                            </button>
                            <button
                                onClick={() => setFilteredProducts(products)}
                                className="px-3 py-2 text-sm bg-green-600 text-white border border-green-600 rounded-md hover:bg-green-700 transition-colors"
                            >
                                All Products
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Price:</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => {
                                    const cheapProducts = products.filter(p => parseFloat(p.price) < 50);
                                    setFilteredProducts(cheapProducts);
                                }}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Under Rs:50
                            </button>
                            <button
                                onClick={() => {
                                    const midProducts = products.filter(p => parseFloat(p.price) >= 50 && parseFloat(p.price) <= 200);
                                    setFilteredProducts(midProducts);
                                }}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Rs:50 - Rs:200
                            </button>
                        </div>
                    </div>
                    <div className="relative w-full lg:w-120">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {searchTerm && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Showing results for:</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            "{searchTerm}"
                            <button
                                onClick={clearSearch}
                                className="ml-2 text-green-600 hover:text-green-800"
                            >
                                ✕
                            </button>
                        </span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilteredProducts(products);
                        }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Show All Products
                    </button>
                </div>
            )}
            <div className="mt-8 flex justify-center">
                <Link
                    to="/shop"
                    className="inline-flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 border border-blue-600 hover:border-blue-800 rounded-lg px-6 py-2 w-auto min-w-[200px]"
                >
                    View All Products
                </Link>
            </div>
        </div>
    );
};

export default Products;
