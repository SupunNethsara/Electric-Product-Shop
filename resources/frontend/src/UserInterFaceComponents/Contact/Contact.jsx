import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare, FiShield, FiVideo, FiHome } from 'react-icons/fi';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add form submission logic here
        alert('Thank you for your inquiry! Our security experts will contact you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactItems = [
        {
            icon: <FiMapPin className="w-6 h-6" />,
            title: "Our Office",
            content: "123 Security Plaza\nTech District, City 94107",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: <FiMail className="w-6 h-6" />,
            title: "Email Us",
            content: "security@cctvsolutions.com\nsupport@cctvsolutions.com",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            icon: <FiPhone className="w-6 h-6" />,
            title: "24/7 Support",
            content: "+1 (555) 123-SAFE\nEmergency: +1 (555) 911-SECURE",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            icon: <FiClock className="w-6 h-6" />,
            title: "Business Hours",
            content: "Monday - Friday: 8:00 - 18:00\nSaturday: 9:00 - 16:00\nEmergency: 24/7",
            color: "text-amber-600",
            bg: "bg-amber-50"
        }
    ];

    const securityServices = [
        {
            icon: <FiVideo className="w-5 h-5" />,
            text: "4K CCTV System Installation"
        },
        {
            icon: <FiHome className="w-5 h-5" />,
            text: "Home Security Assessment"
        },
        {
            icon: <FiShield className="w-5 h-5" />,
            text: "Business Security Solutions"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen  py-6 px-4 sm:px-6 lg:px-3">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-200"
                    >
                        <div className="flex items-center mb-8">
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4">
                                <FiMessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Get a Free Security Quote</h2>
                                <p className="text-gray-600 mt-1">Fill out the form and our expert will contact you within 24 hours</p>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                            <h3 className="font-semibold text-gray-900 mb-2">Services we offer:</h3>
                            <div className="space-y-2">
                                {securityServices.map((service, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-700">
                                        <span className="text-blue-600 mr-2">{service.icon}</span>
                                        {service.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={item}>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        placeholder="John Doe"
                                        required
                                    />
                                </motion.div>
                                <motion.div variants={item}>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={item}>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Interested In *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    required
                                >
                                    <option value="">Select a service</option>
                                    <option value="4k-cctv">4K CCTV Systems</option>
                                    <option value="home-security">Home Security Solutions</option>
                                    <option value="wireless-cameras">Wireless Outdoor Cameras</option>
                                    <option value="business-security">Business Security Systems</option>
                                    <option value="consultation">Security Consultation</option>
                                    <option value="other">Other</option>
                                </select>
                            </motion.div>

                            <motion.div variants={item}>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Details *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                                    placeholder="Tell us about your security needs, property size, and any specific concerns..."
                                    required
                                ></textarea>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 flex items-center justify-center space-x-2"
                            >
                                <FiSend className="w-5 h-5" />
                                <span>Get Free Security Assessment</span>
                            </motion.button>

                            <p className="text-center text-sm text-gray-500">
                                We respect your privacy. Your information is secure with us.
                            </p>
                        </form>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate={isVisible ? "show" : "hidden"}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {contactItems.map((contact, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className={`p-6 rounded-2xl ${contact.bg} border border-gray-200 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]`}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${contact.bg} flex items-center justify-center mb-4 border ${contact.color.replace('text', 'border')} border-opacity-20`}>
                                        <span className={contact.color}>
                                            {contact.icon}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">{contact.content}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-red-600 text-white p-6 rounded-2xl text-center"
                        >
                            <div className="flex items-center justify-center mb-2">
                                <FiShield className="w-6 h-6 mr-2" />
                                <h3 className="text-xl font-bold">24/7 Emergency Support</h3>
                            </div>
                            <p className="text-red-100">For urgent security issues, call our emergency line</p>
                            <p className="text-2xl font-bold mt-2">+1 (555) 911-SECURE</p>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 transform hover:scale-[1.01] transition-all duration-500"
                        >
                            <div className="aspect-w-16 aspect-h-9 w-full">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0350758097005!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1645839197081!5m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="rounded-2xl h-80 w-full"
                                    title="Our Security Office Location"
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
