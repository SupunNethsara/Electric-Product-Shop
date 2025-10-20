// ValidationResults.js
import React from 'react';

const ValidationResults = ({ validationResult }) => {
    if (!validationResult || validationResult.status !== 'failed') {
        return null;
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">Validation Errors Found:</h4>
            {validationResult.details_errors && validationResult.details_errors.length > 0 && (
                <div className="mb-3">
                    <h5 className="text-red-700 text-sm font-medium">Details File Errors:</h5>
                    <ul className="text-red-600 text-sm list-disc list-inside">
                        {validationResult.details_errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            {validationResult.pricing_errors && validationResult.pricing_errors.length > 0 && (
                <div>
                    <h5 className="text-red-700 text-sm font-medium">Pricing File Errors:</h5>
                    <ul className="text-red-600 text-sm list-disc list-inside">
                        {validationResult.pricing_errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ValidationResults;
