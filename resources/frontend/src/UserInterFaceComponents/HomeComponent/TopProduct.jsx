import React from "react";

function TopProduct() {
    const themeColors = {
        primary: "#0866ff",
        primaryHover: "#0759e0",
        secondary: "#e3251b",
        secondaryHover: "#c91f16",
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:h-[500px]">
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] h-[200px] sm:h-[240px]">
                <div
                    className="w-1/2 flex items-center justify-center p-3 sm:p-4"
                    style={{ backgroundColor: `${themeColors.primary}10` }}
                >
                    <img
                        src="/CCTV.png"
                        alt="4K Security Camera System"
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-[1.1] transition-transform duration-500"
                    />
                </div>

                <div className="w-1/2 flex flex-col justify-center p-4 sm:p-6 space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        HOME SECURITY
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        4K CCTV System
                    </h2>
                    <p className="text-xs text-gray-600 hidden sm:block">
                        4-camera setup with night vision
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg sm:text-xl font-extrabold text-blue-600 leading-none">
                            Rs299.99
                        </p>
                        <p className="text-sm text-gray-400 line-through hidden sm:block">
                            Rs374.99
                        </p>
                    </div>

                    <button
                        className="mt-2 sm:mt-3 w-full text-xs sm:text-sm font-semibold text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: themeColors.primary,
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor =
                                themeColors.primaryHover)
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor =
                                themeColors.primary)
                        }
                    >
                        Secure Your Home
                    </button>
                </div>
            </div>

            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] h-[200px] sm:h-[240px]">
                <div
                    className="w-1/2 flex items-center justify-center p-3 sm:p-4"
                    style={{ backgroundColor: `${themeColors.secondary}10` }}
                >
                    <img
                        src="/cctv2.png"
                        alt="Wireless Outdoor Camera"
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-[1.1] transition-transform duration-500"
                    />
                </div>

                <div className="w-1/2 flex flex-col justify-center p-4 sm:p-6 space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        WIRELESS SOLUTION
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Outdoor Camera
                    </h2>
                    <p className="text-xs text-gray-600 hidden sm:block">
                        Weatherproof & battery powered
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg sm:text-xl font-extrabold text-red-600 leading-none">
                            Rs129.99
                        </p>
                        <p className="text-sm text-gray-400 line-through hidden sm:block">
                            Rs159.99
                        </p>
                    </div>

                    <button
                        className="mt-2 sm:mt-3 w-full text-xs sm:text-sm font-semibold text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: themeColors.secondary,
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor =
                                themeColors.secondaryHover)
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor =
                                themeColors.secondary)
                        }
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TopProduct;
