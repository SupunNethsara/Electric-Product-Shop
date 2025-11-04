import Header from "./AdminComponents/Header.jsx";
import { Routes ,Route } from "react-router-dom";
import SaStatics from "./SuperAdminRoutes/SaStatics.jsx";


const SuperAdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
                <Route index element={<SaStatics />} />
                <Route path="/sastatics" element={<SaStatics />} />

            </Routes>
        </div>
    );
};

export default SuperAdminDashboard;
