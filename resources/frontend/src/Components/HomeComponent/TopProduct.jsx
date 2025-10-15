import React from 'react';

function TopProduct() {
    return (
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-between lg:h-[500px]">

            <div className="relative h-[calc(50%-0.75rem)] bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">

                <div className="w-1/2 bg-green-100 flex items-center justify-center p-4">
                    <img
                        src="/GreenPhone.png"
                        alt="Phone Case"
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-[1.1] transition-transform duration-500"
                    />
                </div>

                <div className="w-1/2 flex flex-col justify-center p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-medium">WEEKEND SPECIAL</p>
                    <h2 className="text-xl font-bold text-gray-900">Phone Cases</h2>

                    <p className="text-4xl font-extrabold text-green-600 leading-none">
                        -15%
                    </p>
                    <p className="text-sm font-medium text-green-500 mt-0">
                        + FREE SHIPPING
                    </p>

                    <button className="mt-4 w-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors duration-300 shadow-md">
                        Grab The Deal
                    </button>
                </div>
            </div>

            <div className="relative h-[calc(50%-0.75rem)] bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] mt-6">

                <div className="w-1/2 bg-red-100 flex items-center justify-center p-4">
                    <img
                        src="/RedSpeeker.png"
                        alt="Smart Speaker"
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-[1.1] transition-transform duration-500"
                    />
                </div>

                <div className="w-1/2 flex flex-col justify-center p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-medium">LIMITED TIME</p>
                    <h2 className="text-xl font-bold text-gray-900">Smart Speaker</h2>

                    <p className="text-4xl font-extrabold text-red-600 leading-none">
                        $89<span className="text-3xl font-extrabold">.99</span>
                    </p>
                    <p className="text-sm font-medium text-red-500 mt-0">
                        20% OFF MSRP
                    </p>

                    <button className="mt-4 w-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 py-2 rounded-lg transition-colors duration-300 shadow-md">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TopProduct;
