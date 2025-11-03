import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/all-users');

                const usersWithProperData = (response.data.users || []).map(user => ({
                    ...user,
                    is_active: user.is_active !== undefined ? user.is_active : true,
                    profile: user.profile || null
                }));

                setUsers(usersWithProperData);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const toggleUserStatus = async (userId, currentStatus) => {
        setUpdatingStatus(userId);
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/admin/deactivate-user/${userId}`
            );

            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, is_active: !currentStatus }
                    : user
            ));

            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, is_active: !currentStatus });
            }

        } catch (err) {
            console.error('Error updating user status:', err);
            setError(err.response?.data?.message || 'Failed to update user status');
        } finally {
            setUpdatingStatus(null);
        }
    };


    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'super_admin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'User':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusInfo = (isActive) => {
        return {
            color: isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            text: isActive ? 'Active' : 'Inactive'
        };
    };

    const hasProfileData = (profile) => {
        if (!profile) return false;
        return profile.phone || profile.address || profile.city || profile.country ||
            profile.postal_code || profile.bio || profile.birth_date || profile.gender;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <div className="text-red-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-red-800 font-medium">Error loading users</h3>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage all users in the system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                            <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                {users.filter(user => user.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Inactive Users</h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                {users.filter(user => !user.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                {users.filter(user => user.role === 'admin' || user.role === 'super_admin').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">All Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
                            const statusInfo = getStatusInfo(user.is_active);
                            return (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => handleUserClick(user)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                                            disabled={updatingStatus === user.id}
                                            className={`px-3 py-1 rounded-md transition duration-200 ${
                                                user.is_active
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        >
                                            {updatingStatus === user.id ? (
                                                'Updating...'
                                            ) : (
                                                user.is_active ? 'Deactivate' : 'Activate'
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center pb-3 border-b">
                                <h3 className="text-xl font-medium text-gray-900">User Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                                            {selectedUser.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusInfo(selectedUser.is_active).color}`}>
                                            {getStatusInfo(selectedUser.is_active).text}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(selectedUser.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Profile Information */}
                                <div className="border-t pt-4">
                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Profile Information</h4>
                                    {selectedUser.profile && hasProfileData(selectedUser.profile) ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedUser.profile.phone || 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedUser.profile.gender || 'Not provided'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {selectedUser.profile.address || 'Not provided'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedUser.profile.city || 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedUser.profile.country || 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedUser.profile.postal_code || 'Not provided'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedUser.profile.birth_date
                                                            ? new Date(selectedUser.profile.birth_date).toLocaleDateString()
                                                            : 'Not provided'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Bio - Full width */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {selectedUser.profile.bio || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No profile information available
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => toggleUserStatus(selectedUser.id, selectedUser.is_active)}
                                    disabled={updatingStatus === selectedUser.id}
                                    className={`px-4 py-2 rounded-md transition duration-200 ${
                                        selectedUser.is_active
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    {updatingStatus === selectedUser.id ? 'Updating...' : (selectedUser.is_active ? 'Deactivate User' : 'Activate User')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManage;
