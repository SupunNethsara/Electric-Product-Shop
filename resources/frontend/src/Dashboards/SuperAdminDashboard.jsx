import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuperAdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">System Administrator: {user?.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Go to Store
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                System Overview
                            </h3>
                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Admins</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
