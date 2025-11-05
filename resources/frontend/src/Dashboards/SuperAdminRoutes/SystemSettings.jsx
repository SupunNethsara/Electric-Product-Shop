import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SystemSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        siteName: '',
        adminEmail: '',
        mobile: '',
        address: '',
        siteDescription: '',
        itemsPerPage: 24,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/system-settings');
            const data = response.data;

            setSettings({
                siteName: data.site_name || '',
                adminEmail: data.admin_email || '',
                mobile: data.mobile || '',
                address: data.address || '',
                siteDescription: data.site_description || '',
                itemsPerPage: data.items_per_page || 24,
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveSettings = async () => {
        try {
            setLoading(true);
            setMessage('');

            const response = await axios.put('http://127.0.0.1:8000/api/system-settings', {
                siteName: settings.siteName,
                adminEmail: settings.adminEmail,
                mobile: settings.mobile,
                address: settings.address,
                siteDescription: settings.siteDescription,
                itemsPerPage: settings.itemsPerPage,
            });

            setMessage(response.data.message);

            const updatedData = response.data.data;
            setSettings({
                siteName: updatedData.site_name,
                adminEmail: updatedData.admin_email,
                mobile: updatedData.mobile,
                address: updatedData.address,
                siteDescription: updatedData.site_description,
                itemsPerPage: updatedData.items_per_page,
            });

        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    const resetSettings = () => {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            setSettings({
                siteName: 'My Ecommerce Store',
                adminEmail: 'admin@store.com',
                mobile: '+94 71 123 4567',
                address: '123 Main Street, Colombo, Sri Lanka',
                siteDescription: 'Best online shopping experience',
                itemsPerPage: 24,
            });
        }
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                        message.includes('Error')
                            ? 'bg-red-50 border-red-400 text-red-700'
                            : 'bg-green-50 border-green-400 text-green-700'
                    }`}>
                        <div className="flex items-center">
                            <span className="text-lg mr-2">
                                {message.includes('Error') ? '❌' : '✅'}
                            </span>
                            {message}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-64">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">System Settings</h3>
                            <nav className="space-y-2">
                                {[
                                    { id: 'general', label: 'General Settings', icon: '⚙️' },
                                    { id: 'security', label: 'Security & Access', icon: '🔒' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <span className="text-xl">{tab.icon}</span>
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800">General Settings</h2>
                                        <p className="text-gray-600 mt-2">Manage your site's basic information and preferences</p>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center items-center py-12">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                                            <span className="ml-3 text-gray-600">Loading settings...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Site Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.siteName}
                                                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="Enter your site name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Admin Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={settings.adminEmail}
                                                        onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="admin@example.com"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Mobile Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.mobile}
                                                        onChange={(e) => handleSettingChange('mobile', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="+94 71 123 4567"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Items Per Page
                                                    </label>
                                                    <select
                                                        value={settings.itemsPerPage}
                                                        onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                    >
                                                        <option value={12}>12 items</option>
                                                        <option value={24}>24 items</option>
                                                        <option value={48}>48 items</option>
                                                        <option value={96}>96 items</option>
                                                    </select>
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Address
                                                    </label>
                                                    <textarea
                                                        value={settings.address}
                                                        onChange={(e) => handleSettingChange('address', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="Enter your business address"
                                                    />
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Site Description
                                                    </label>
                                                    <textarea
                                                        value={settings.siteDescription}
                                                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                                                        rows={3}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="Describe your ecommerce store"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                                                <button
                                                    onClick={saveSettings}
                                                    disabled={loading}
                                                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Saving...
                                                        </span>
                                                    ) : (
                                                        'Save Settings'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={resetSettings}
                                                    disabled={loading}
                                                    className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Reset to Defaults
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="text-center py-16">
                                    <div className="text-gray-300 text-6xl mb-4">🔒</div>
                                    <h3 className="text-2xl font-semibold text-gray-600 mb-3">Security & Access</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Enhanced security features are coming soon. We're working on advanced access controls and security settings to keep your platform safe.
                                    </p>
                                    <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                        Coming Soon
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemSettings;
