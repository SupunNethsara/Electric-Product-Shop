import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Heart
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Shop",
            links: [
                { name: "All Products", href: "/shop" },
                { name: "New Arrivals", href: "/shop?filter=new" },
                { name: "Best Sellers", href: "/shop?filter=bestsellers" },
                { name: "Sale Items", href: "/shop?filter=sale" },
                { name: "Gift Cards", href: "/gift-cards" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Contact Us", href: "/contact" },
                { name: "Shipping Info", href: "/shipping" },
                { name: "Returns & Exchanges", href: "/returns" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "FAQs", href: "/faqs" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Blog", href: "/blog" }
            ]
        }
    ];



    const socialLinks = [
        {
            name: "Facebook",
            icon: <Facebook className="w-5 h-5" />,
            href: "https://facebook.com"
        },
        {
            name: "Twitter",
            icon: <Twitter className="w-5 h-5" />,
            href: "https://twitter.com"
        },
        {
            name: "Instagram",
            icon: <Instagram className="w-5 h-5" />,
            href: "https://instagram.com"
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="w-5 h-5" />,
            href: "https://linkedin.com"
        }
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-4">
                            <div className="text-3xl font-semibold">
                                <span className="text-green-600">go</span>cart
                                <span className="text-green-600 text-4xl">.</span>
                            </div>
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Your trusted partner for quality electronics and gadgets.
                            We bring you the latest technology with unbeatable prices
                            and exceptional customer service.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Phone className="w-4 h-4 text-green-600" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Mail className="w-4 h-4 text-green-600" />
                                <span>support@gocart.com</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                <span>Address</span>
                            </div>
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-lg mb-4 text-white">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-300 hover:text-green-600 transition-colors duration-200 text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 my-8"></div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm">Follow us:</span>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-green-600 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 my-6"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    <div className="text-gray-400 text-sm">
                        &copy; {currentYear} GoCart. All rights reserved.
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <Link
                            to="/privacy"
                            className="hover:text-green-600 transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link
                            to="/terms"
                            className="hover:text-green-600 transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                        <span>•</span>
                        <Link
                            to="/cookies"
                            className="hover:text-green-600 transition-colors duration-200"
                        >
                            Cookie Policy
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for our customers
                    </div>
                </div>
            </div>


        </footer>
    );
};

export default Footer;
