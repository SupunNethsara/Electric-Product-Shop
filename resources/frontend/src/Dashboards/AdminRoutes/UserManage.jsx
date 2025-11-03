import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    // Mock data - replace with actual API call
    const mockUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'registered',
            registration_method: 'google',
            registration_date: '2025-01-15',
            status: 'active',
            orders_count: 5,
            last_login: '2025-11-02T10:30:00Z'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'registered',
            registration_method: 'email',
            registration_date: '2025-01-10',
            status: 'active',
            orders_count: 12,
            last_login: '2025-11-01T15:45:00Z'
        },
        {
            id: 3,
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            registration_method: 'email',
            registration_date: '2025-01-01',
            status: 'active',
            orders_count: 0,
            last_login: '2025-11-02T08:20:00Z'
        }
    ];

    useEffect(() => {
        // Simulate API call
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                // Uncomment when API is ready
                // const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
                //     headers: { Authorization: `Bearer ${token}` }
                // });
                // setUsers(response.data.users);

                setUsers(mockUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            'super_admin': 'bg-purple-100 text-purple-800 border border-purple-200',
            'admin': 'bg-blue-100 text-blue-800 border border-blue-200',
            'registered': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
            'guest': 'bg-gray-100 text-gray-800 border border-gray-200'
        };

        const roleLabels = {
            'super_admin': 'Super Admin',
            'admin': 'Admin',
            'registered': 'Registered User',
            'guest': 'Guest User'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100'}`}>
                {roleLabels[role] || role}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        return status === 'active'
            ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>
            : <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Inactive</span>;
    };

    const getRegistrationMethodIcon = (method) => {
        const icons = {
            'google': '🔗',
            'email': '📧',
            'facebook': '👤',
            'social': '🌐'
        };
        return icons[method] || '👤';
    };

    // Filter users based on search and role filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

            // Uncomment when API is ready
            // await axios.put(`http://127.0.0.1:8000/api/admin/users/${userId}/status`,
            //     { status: newStatus },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // );

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-emerald-700">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-emerald-900 mb-2">User Management</h1>
                <p className="text-emerald-600">Manage registered users, admins, and user roles</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-900">
                        {users.filter(u => u.role === 'registered').length}
                    </div>
                    <div className="text-sm text-emerald-600">Registered Users</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-900">
                        {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
                    </div>
                    <div className="text-sm text-emerald-600">Admin Users</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-900">
                        {users.filter(u => u.status === 'active').length}
                    </div>
                    <div className="text-sm text-emerald-600">Active Users</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="registered">Registered User</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-emerald-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">Registration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">Orders</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">Last Login</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-100">
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-emerald-50">
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="font-medium text-emerald-900">{user.name}</div>
                                        <div className="text-sm text-emerald-600">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span>{getRegistrationMethodIcon(user.registration_method)}</span>
                                        <div>
                                            <div className="text-sm text-emerald-900">{formatDate(user.registration_date)}</div>
                                            <div className="text-xs text-emerald-600 capitalize">{user.registration_method}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {user.orders_count} orders
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="px-4 py-3 text-sm text-emerald-600">
                                    {formatDateTime(user.last_login)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewUser(user)}
                                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleStatusToggle(user.id, user.status)}
                                            className={`text-sm font-medium ${
                                                user.status === 'active'
                                                    ? 'text-amber-600 hover:text-amber-700'
                                                    : 'text-emerald-600 hover:text-emerald-700'
                                            }`}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-emerald-200 flex items-center justify-between">
                        <div className="text-sm text-emerald-600">
                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-emerald-200 rounded text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border border-emerald-200 rounded text-sm ${
                                        currentPage === page ? 'bg-emerald-600 text-white' : 'text-emerald-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-emerald-200 rounded text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-900">User Details</h3>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="text-emerald-600 hover:text-emerald-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-emerald-700">Name</label>
                                <p className="text-emerald-900">{selectedUser.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700">Email</label>
                                <p className="text-emerald-900">{selectedUser.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700">Role</label>
                                <p>{getRoleBadge(selectedUser.role)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700">Registration Date</label>
                                <p className="text-emerald-900">{formatDate(selectedUser.registration_date)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700">Total Orders</label>
                                <p className="text-emerald-900">{selectedUser.orders_count}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700">Last Login</label>
                                <p className="text-emerald-900">{formatDateTime(selectedUser.last_login)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManage;
