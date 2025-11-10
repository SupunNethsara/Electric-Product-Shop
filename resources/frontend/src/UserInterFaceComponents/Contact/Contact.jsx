import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare } from 'react-icons/fi';

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
    };

    const contactItems = [
        {
            icon: <FiMapPin className="w-6 h-6" />,
            title: "Our Location",
            content: "123 Innovation Drive, San Francisco, CA 94107",
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            icon: <FiMail className="w-6 h-6" />,
            title: "Email Us",
            content: "hello@example.com\nsupport@example.com",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            icon: <FiPhone className="w-6 h-6" />,
            title: "Call Us",
            content: "+1 (555) 123-4567\nMon-Fri: 9:00 AM - 6:00 PM",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            icon: <FiClock className="w-6 h-6" />,
            title: "Working Hours",
            content: "Monday - Friday: 9:00 - 18:00\nSaturday: 10:00 - 15:00\nSunday: Closed",
            color: "text-amber-500",
            bg: "bg-amber-50"
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
        <div className="h-auto bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-3 lg:px-2">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 backdrop-blur-sm bg-opacity-90"
                    >
                        <div className="flex items-center mb-8">
                            <div className="p-3 rounded-xl bg-blue-50 text-green-500 mr-4">
                                <FiMessageSquare className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className=" h-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={item}>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                        placeholder="John Doe"
                                        required
                                    />
                                </motion.div>
                                <motion.div variants={item}>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={item}>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                                    placeholder="How can we help you today?"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={item}>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 resize-none"
                                    placeholder="Tell us more about your project..."
                                    required
                                ></textarea>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 flex items-center justify-center space-x-2"
                            >
                                <FiSend className="w-5 h-5" />
                                <span>Send Message</span>
                            </motion.button>
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
                                    className={`p-6 rounded-2xl ${contact.bg} hover:shadow-md transition-all duration-300`}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${contact.bg} flex items-center justify-center mb-4`}>
                                        <span className={contact.color}>
                                            {contact.icon}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{contact.content}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500"
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
                                    title="Our Location on Map"
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
