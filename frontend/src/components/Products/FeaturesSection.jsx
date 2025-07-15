import React from 'react';
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2';

function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <HiShoppingBag className="text-3xl text-black" />
          </div>
          <h4 className="text-lg font-semibold tracking-tight mb-2">
            FREE INTERNATIONAL SHIPPING
          </h4>
          <p className="text-gray-600 text-sm tracking-tight">
            On all orders over $100.00
          </p>
        </div>

        {/* feature 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <HiArrowPathRoundedSquare className="text-3xl text-black" />
          </div>
          <h4 className="text-lg font-semibold tracking-tight mb-2">
            45 DAYS RETURN
          </h4>
          <p className="text-gray-600 text-sm tracking-tight">
            Money back guarantee
          </p>
        </div>

        {/* feature 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <HiOutlineCreditCard className="text-3xl text-black" />
          </div>
          <h4 className="text-lg font-semibold tracking-tight mb-2">
            SECURE CHECKOUT
          </h4>
          <p className="text-gray-600 text-sm tracking-tight">
            100% secured checkout process
          </p>
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;
