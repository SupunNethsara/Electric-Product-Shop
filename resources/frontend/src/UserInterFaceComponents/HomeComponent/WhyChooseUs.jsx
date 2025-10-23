import React from 'react';
import { Shield, Truck, Clock, HeadphonesIcon } from 'lucide-react';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Quality Guarantee",
            description: "All products are thoroughly tested and come with warranty"
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: "Free Shipping",
            description: "Free delivery on orders above $50 across the country"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Quick Delivery",
            description: "Get your orders delivered within 2-3 business days"
        },
        {
            icon: <HeadphonesIcon className="w-8 h-8" />,
            title: "24/7 Support",
            description: "Round-the-clock customer support for all your queries"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Why Choose GoCart?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're committed to providing the best shopping experience for our customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 mb-4">
                                <div className="text-green-600">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
