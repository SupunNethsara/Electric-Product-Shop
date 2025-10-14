import ProductCard from "./ProductCard.jsx";


const Products = () => {
    const products = [
        {
            id: 1,
            name: 'Product 1',
            price: 29.99,
            image: 'https://via.placeholder.com/300',
            description: 'Product description'
        },
        {
            id: 2,
            name: 'Product 2',
            price: 39.99,
            image: 'https://via.placeholder.com/300',
            description: 'Product description'
        },
        {
            id: 3,
            name: 'Product 3',
            price: 49.99,
            image: 'https://via.placeholder.com/300',
            description: 'Product description'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Products;
