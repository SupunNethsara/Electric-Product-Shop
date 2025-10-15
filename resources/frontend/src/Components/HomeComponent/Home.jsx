import SliderSection from "./SliderSection";
import TopProduct from "./TopProduct.jsx";
import CategoriesMarquee from "./CategoriesMarquee.jsx";
import Products from "../Products.jsx";

function Home() {
    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-0">
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

export default Home;
