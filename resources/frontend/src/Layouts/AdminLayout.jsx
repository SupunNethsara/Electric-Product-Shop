import Sidebar from "../Dashboards/AdminComponents/Sidebar.jsx";


const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 pl-2 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
