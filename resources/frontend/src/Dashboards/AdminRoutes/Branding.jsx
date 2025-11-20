import React, {useState} from 'react';
import HomeBannerControl from "./BrandinComponents/HomeBannerControl.jsx";
import TopProductControl from "./BrandinComponents/TopProductControl.jsx";

function Branding() {
    const [activeSection, setActiveSection] = useState('home');

    const sections = [
        { id: 'home', label: 'Home Banner', icon: '🏠' },
        { id: 'products', label: 'Top Products', icon: '⭐' },
        { id: 'about', label: 'About', icon: 'ℹ️' },
        { id: 'contact', label: 'Contact', icon: '📞' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span>{section.icon}</span>
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {activeSection === 'home' && <HomeBannerControl />}
                {activeSection === 'products' && <TopProductControl />}
                {/*{activeSection === 'about' && <AboutSection />}*/}
                {/*{activeSection === 'contact' && <ContactSection />}*/}
            </div>
        </div>
    );
}

export default Branding;
