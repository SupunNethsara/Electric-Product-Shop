import { Route, Routes } from "react-router-dom";
import HomeSection from "../Common/HomeSection.jsx";
import ProductShop from "../Shop/ProductShop.jsx";

function UserInterFace() {
    return (
        <div className="h-auto bg-gray-50 pt-32 pb-20">
            <Routes>
                <Route path="/" element={<HomeSection />} />
                <Route path="/home" element={<HomeSection/>}/>
                <Route path="/shop" element={<ProductShop/>}/>

            </Routes>
        </div>
    );
}

export default UserInterFace;
