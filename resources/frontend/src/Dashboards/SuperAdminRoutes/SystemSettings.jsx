import React, { useState } from 'react';

function SystemSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        siteName: 'My Ecommerce Store',
        adminEmail: 'admin@store.com',
        mobile: '+94 71 123 4567',
        address: '123 Main Street, Colombo, Sri Lanka',
        siteDescription: 'Best online shopping experience',
        itemsPerPage: 24,
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveSettings = () => {
        console.log('Saving settings:', settings);
        alert('Settings saved successfully!');
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your ecommerce platform settings</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-64">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                            <nav className="space-y-2">
                                {[
                                    { id: 'general', label: 'General Settings', icon: '⚙️' },
                                    { id: 'security', label: 'Security & Access', icon: '🔒' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* General Settings */}
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">
                                        General Settings
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Site Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Site Name
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.siteName}
                                                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        </div>

                                        {/* Admin Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Admin Email
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.adminEmail}
                                                onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        </div>

                                        {/* Mobile Number */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.mobile}
                                                onChange={(e) => handleSettingChange('mobile', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            <textarea
                                                value={settings.address}
                                                onChange={(e) => handleSettingChange('address', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        </div>

                                        {/* Site Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Site Description
                                            </label>
                                            <textarea
                                                value={settings.siteDescription}
                                                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        </div>

                                        {/* Items Per Page */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Items Per Page
                                            </label>
                                            <select
                                                value={settings.itemsPerPage}
                                                onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            >
                                                <option value={12}>12</option>
                                                <option value={24}>24</option>
                                                <option value={48}>48</option>
                                                <option value={96}>96</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={saveSettings}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                        >
                                            Save Settings
                                        </button>
                                        <button
                                            onClick={resetSettings}
                                            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Reset to Defaults
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="flex items-center justify-center h-40 text-gray-500 text-lg font-semibold">
                                    🔒 Security settings — Coming Soon...
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
