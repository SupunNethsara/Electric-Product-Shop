import Header from "./AdminComponents/Header.jsx";
import { Routes ,Route } from "react-router-dom";


const SuperAdminDashboard = () => {
    return (
        <div className="min-h-screen rounded-2xl bg-gray-50">
            <Header />
            <main>
                <Routes>

                </Routes>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
