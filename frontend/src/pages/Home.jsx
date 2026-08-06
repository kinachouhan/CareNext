import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import HeroCategories from "../features/home/components/HeroCategories";

const Home = () => {
    const navigate = useNavigate()
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Banner */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#06A1B7] to-cyan-700 rounded-3xl overflow-hidden">
          <div className=" items-center">
            {/* Left Content */}
            <div className="p-8 lg:p-12">
              <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-4">
                Trusted by Dental Professionals
              </span>
               <div className="flex  py-6">
              <img
                src="/Logo.png"
                alt="Dental Instruments"
                className="w-full max-w-md bg-white rounded-xl"
              />
            </div> 

              <p className="text-cyan-100 mt-6 leading-7">
                Discover premium dental instruments and clinical equipment
                designed for dentists, hospitals, clinics and dental students.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={()=> navigate("/shop")} className="w-full sm:w-auto bg-white text-[#06A1B7] px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                  Shop Now
                  <ArrowRight size={18} />
                </button>

                <button onClick={()=> navigate("/shop")} className="w-full sm:w-auto border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-[#06A1B7] transition">
                  Explore Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Offer Cards */}
        <div className="flex flex-col gap-6">
          {/* Offer Card */}
          <div className="bg-white rounded-3xl shadow-md p-6 flex-1">
            <span className="text-sm text-[#06A1B7] font-semibold">
              LIMITED OFFER
            </span>

            <h3 className="text-2xl font-bold mt-3">Up to 30% OFF</h3>

            <p className="text-gray-600 mt-2">
              Selected Dental Kits & Surgical Instruments.
            </p>

            <button className="mt-6 bg-[#06A1B7] text-white px-5 py-2 rounded-full hover:bg-cyan-700 transition">
              Shop Offer
            </button>
          </div>

          {/* New Arrival */}
          <div className="bg-[#0F172A] rounded-3xl p-6 text-white flex-1">
            <span className="text-cyan-300 text-sm">NEW ARRIVAL</span>

            <h3 className="text-2xl font-bold mt-3">Dental Handpieces</h3>

            <p className="text-gray-300 mt-2">
              High-performance instruments for professional dental procedures.
            </p>

            <button onClick={()=> navigate("/shop")} className="mt-6 border border-[#06A1B7] text-[#06A1B7] px-5 py-2 rounded-full hover:bg-[#06A1B7] hover:text-white transition">
              View Collection
            </button>
          </div>
        </div>
      </div>

      <HeroCategories/>
    </section>
  );
};

export default Home;
