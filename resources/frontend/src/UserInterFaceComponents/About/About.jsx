import React from "react";
import {
    FiAward,
    FiUsers,
    FiShield,
    FiEye,
    FiCheckCircle,
    FiVideo,
    FiHome,
    FiLock,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const stats = [
        {
            icon: <FiAward className="w-8 h-8" />,
            value: "10+",
            label: "Years in Security",
        },
        {
            icon: <FiUsers className="w-8 h-8" />,
            value: "5000+",
            label: "Protected Homes",
        },
        {
            icon: <FiCheckCircle className="w-8 h-8" />,
            value: "15K+",
            label: "Systems Installed",
        },
        {
            icon: <FiShield className="w-8 h-8" />,
            value: "24/7",
            label: "Monitoring",
        },
    ];

    const values = [
        {
            title: "Advanced Security",
            description:
                "Providing cutting-edge CCTV and surveillance solutions to keep your property safe and secure.",
            icon: <FiEye className="w-6 h-6" />,
        },
        {
            title: "Quality Assurance",
            description:
                "Every product meets the highest standards of quality and reliability for your peace of mind.",
            icon: <FiAward className="w-6 h-6" />,
        },
        {
            title: "Total Protection",
            description:
                "Comprehensive security solutions that cover all aspects of home and business protection.",
            icon: <FiShield className="w-6 h-6" />,
        },
    ];

    const features = [
        {
            icon: <FiVideo className="w-8 h-8" />,
            title: "4K CCTV Systems",
            description:
                "Crystal clear surveillance with night vision capabilities",
        },
        {
            icon: <FiHome className="w-8 h-8" />,
            title: "Home Security",
            description:
                "Complete protection solutions for residential properties",
        },
        {
            icon: <FiLock className="w-8 h-8" />,
            title: "Wireless Solutions",
            description: "Weatherproof and battery-powered outdoor cameras",
        },
    ];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        About Our Security Solutions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Delivering advanced security solutions since 2013. We
                        specialize in state-of-the-art CCTV systems and
                        comprehensive home security to protect what matters most
                        to you.
                    </motion.p>
                </div>

                <motion.div
                    ref={ref}
                    variants={container}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
                        >
                            <div className="text-blue-600 mb-4 flex justify-center">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {stat.value}
                            </h3>
                            <p className="text-gray-600 mt-2 font-medium">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                            Our Story
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Protecting homes and businesses since 2013
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <p className="text-lg text-gray-600 mb-6">
                                    Founded in 2013, we started with a simple
                                    mission: to make advanced security
                                    accessible to everyone. From our first 4K
                                    CCTV system installation to becoming a
                                    trusted security partner for thousands of
                                    homes and businesses.
                                </p>
                                <p className="text-lg text-gray-600">
                                    Our journey has been driven by innovation
                                    and a commitment to keeping your properties
                                    safe. We continuously evolve our technology
                                    to stay ahead of security challenges and
                                    provide peace of mind to our customers.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Our Mission
                                    </h3>
                                    <p className="text-gray-600">
                                        To provide cutting-edge security
                                        solutions that empower homeowners and
                                        businesses with reliable, advanced
                                        protection systems at affordable prices.
                                    </p>
                                </div>
                                <div className="mt-6 bg-gray-50 p-6 rounded-2xl border-l-4 border-gray-400">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Our Vision
                                    </h3>
                                    <p className="text-gray-600">
                                        To create a safer world by making
                                        professional-grade security technology
                                        accessible to everyone, ensuring peace
                                        of mind through innovative surveillance
                                        solutions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-blue-200 font-semibold tracking-wide uppercase">
                            Our Solutions
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Advanced Security Features
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="text-blue-600 mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                            Our Values
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Principles that protect you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                            >
                                <div className="text-blue-600 mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-12 text-white"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Secure Your Property?
                        </h2>
                        <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust us
                            with their security needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                                View Our Products
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
                                Get Free Consultation
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
