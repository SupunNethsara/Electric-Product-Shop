import React from 'react';
import SuperAdminSidebar from "../Dashboards/SuperAdminComponents/SuperAdminSidebar.jsx";

function SuperAdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SuperAdminSidebar/>
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}

export default SuperAdminLayout;
