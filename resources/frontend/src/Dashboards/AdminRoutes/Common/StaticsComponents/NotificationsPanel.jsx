import React from 'react';

function NotificationsPanel({ pendingOrders, totalQuotations }) {
    return (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-900">Attention Required</h4>
                        <p className="text-sm text-amber-700">
                            {pendingOrders} orders pending review • {totalQuotations} quotations awaiting response
                        </p>
                    </div>
                </div>
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    Review Now
                </button>
            </div>
        </div>
    );
}

export default NotificationsPanel;
