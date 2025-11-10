import React from 'react';
import { FiAward, FiUsers, FiShield, FiHeart, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const stats = [
        { icon: <FiAward className="w-8 h-8" />, value: '10+', label: 'Years Experience' },
        { icon: <FiUsers className="w-8 h-8" />, value: '500+', label: 'Happy Clients' },
        { icon: <FiCheckCircle className="w-8 h-8" />, value: '1000+', label: 'Projects Completed' },
        { icon: <FiShield className="w-8 h-8" />, value: '24/7', label: 'Support' }
    ];

    const values = [
        {
            title: 'Customer First',
            description: 'We prioritize our customers in every decision we make, ensuring their success is our success.',
            icon: <FiHeart className="w-6 h-6" />
        },
        {
            title: 'Innovation',
            description: 'Constantly pushing boundaries to deliver cutting-edge solutions that drive real results.',
            icon: <FiAward className="w-6 h-6" />
        },
        {
            title: 'Integrity',
            description: 'We maintain the highest standards of integrity in all of our actions and decisions.',
            icon: <FiShield className="w-6 h-6" />
        }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        About Our Company
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Delivering excellence and innovation since 2013. Our journey has been about creating meaningful
                        solutions that make a difference.
                    </motion.p>
                </div>

                <motion.div
                    ref={ref}
                    variants={container}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="bg-[#f0fdf4] p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
                        >
                            <div className="text-green-500 mb-4 flex justify-center">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-gray-600 mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Our Story</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            A story of growth and innovation
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <p className="text-lg text-gray-600 mb-6">
                                    Founded in 2013, our company started as a small team of passionate individuals with a vision to transform the industry.
                                    Through dedication and innovation, we've grown into a trusted partner for businesses worldwide.
                                </p>
                                <p className="text-lg text-gray-600">
                                    Our commitment to excellence and customer satisfaction has been the driving force behind our success. We believe in building
                                    lasting relationships through transparency, integrity, and exceptional service.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="bg-green-50 p-6 rounded-2xl">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                                    <p className="text-gray-600">
                                        To empower businesses with innovative solutions that drive growth, efficiency, and success in an ever-evolving digital landscape.
                                    </p>
                                </div>
                                <div className="mt-6 bg-gray-50 p-6 rounded-2xl">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                                    <p className="text-gray-600">
                                        To be the global leader in delivering transformative solutions that make a positive impact on businesses and communities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Our Values</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Principles that guide us forward
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="text-green-500 mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
