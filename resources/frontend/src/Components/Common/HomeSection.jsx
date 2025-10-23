import React from "react";
import SliderSection from "../HomeComponent/SliderSection.jsx";
import TopProduct from "../HomeComponent/TopProduct.jsx";
import CategoriesMarquee from "../HomeComponent/CategoriesMarquee.jsx";
import Products from "../Products/Products.jsx";

function HomeSection() {
    return (
        <div>
            <div className="max-w-10/12 mx-auto flex flex-col lg:flex-row gap-6 px-0">
                <div className="w-full lg:w-4/6 lg:h-[500px]">
                    <SliderSection />
                </div>
                <TopProduct/>
            </div>
            <CategoriesMarquee/>
            <Products/>
        </div>
    );
}

export default HomeSection;
