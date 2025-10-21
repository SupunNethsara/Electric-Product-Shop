import ProductCard from "./ProductCard.jsx";
import {useEffect, useState} from "react";
import axios from "axios";


const Products = () => {

const[products , setProducts]=useState([]);

useEffect(()=>{
    const getProductHome =async ()=>{
        await axios.get("http://127.0.0.1:8000/api/products/home")
        .then((response)=>{
            setProducts(response.data);
        })
    }
    console.log(products);
    getProductHome();
} ,[])

    return (
        <div className="max-w-10/12 mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Products;
