import Header from "./AdminComponents/Header.jsx";
import Statics from "./AdminRoutes/Statics.jsx";
import { Routes ,Route } from "react-router-dom";
import Products from "./AdminRoutes/Products.jsx";
import Categories from "./AdminRoutes/Categories.jsx";
import Orders from "./AdminRoutes/Orders.jsx";
import Quotations from "./AdminRoutes/Quotations.jsx";
import UserManage from "./AdminRoutes/UserManage.jsx";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen rounded-2xl bg-gray-50">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Statics />} />
                    <Route path="/products" element={<Products />}/>
                    <Route path="/categories" element={<Categories />}/>
                    <Route path="/orders" element={<Orders />}/>
                    <Route path="/quotations" element={<Quotations />}/>
                    <Route path="/user-manage" element={<UserManage />}/>
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
