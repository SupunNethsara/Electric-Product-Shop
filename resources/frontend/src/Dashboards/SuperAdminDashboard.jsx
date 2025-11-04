import Header from "./AdminComponents/Header.jsx";
import { Routes ,Route } from "react-router-dom";
import SaStatics from "./SuperAdminRoutes/SaStatics.jsx";
import AdminManagement from "./SuperAdminRoutes/AdminManagement.jsx";


const SuperAdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
                <Route index element={<SaStatics />} />
                <Route path="sastatics" element={<SaStatics />} />
                <Route path="adminManage" element={<AdminManagement />} />
            </Routes>
        </div>
    );
};

export default SuperAdminDashboard;
