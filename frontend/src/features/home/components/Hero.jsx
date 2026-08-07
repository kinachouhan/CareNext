import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
      
        <div className="lg:col-span-2 bg-gradient-to-br from-[#06A1B7] via-cyan-700 to-teal-900 rounded-[28px] md:rounded-[32px] overflow-hidden shadow-sm relative flex flex-col justify-between p-6 sm:p-8 lg:p-12 text-white">
          
        
          <div className="absolute right-0 top-0 w-72 sm:w-96 h-72 sm:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
              <ShieldCheck size={14} className="text-cyan-200 shrink-0" />
              <span>Trusted by 5,000+ Dental Professionals</span>
            </span>
          </div>

      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center my-6 md:my-8 relative z-10">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance">
                Precision & Care in Every Dental Instrument
              </h1>
              <p className="text-cyan-100 text-xs sm:text-base leading-relaxed font-normal">
                Discover professional-grade clinical equipment, advanced handpieces, and surgical kits designed for maximum durability and safety.
              </p>
            </div>

            {/* Professional Primary Banner Image */}
            <div className="relative flex justify-center items-center">
              <div className="w-full max-w-[240px] sm:max-w-[300px] md:max-w-[340px] aspect-[4/3] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-2.5 sm:p-3 shadow-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                  alt="Modern Dental Instruments and Equipment"
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Bottom Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 relative z-10">
            <button 
              onClick={() => navigate("/shop")} 
              className="bg-white text-[#06A1B7] hover:bg-cyan-50 px-6 py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 transition-all"
            >
              <span>Shop Collection</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => navigate("/shop")} 
              className="border-2 border-white/80 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center active:scale-95 transition-all"
            >
              Explore Catalog
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT SIDE CARDS (Offers & New Arrivals) */}
        {/* ========================================== */}
        <div className="flex flex-col gap-5 md:gap-6">
          
          {/* Card 1: Limited Offer */}
          <div className="bg-white rounded-[28px] md:rounded-[32px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex-1 flex flex-col justify-between transition-all group">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#06A1B7] bg-cyan-50 px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles size={12} />
                Limited Offer
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2.5 sm:mt-3 tracking-tight">
                Up to 30% OFF
              </h3>

              <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
                Special savings on premium selected dental kits & surgical instruments.
              </p>
            </div>

            <button 
              onClick={() => navigate("/shop")}
              className="mt-5 sm:mt-6 w-full sm:w-fit bg-gray-900 hover:bg-[#06A1B7] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 group-hover:bg-[#06A1B7]"
            >
              <span>Shop Offer</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: New Arrival */}
          <div className="bg-[#0F172A] rounded-[28px] md:rounded-[32px] border border-gray-800 shadow-sm p-6 sm:p-8 flex-1 flex flex-col justify-between text-white transition-all group">
            <div>
              <span className="text-cyan-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
                New Arrival
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2.5 sm:mt-3 tracking-tight">
                Dental Handpieces
              </h3>

              <p className="text-gray-400 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
                High-performance engineered instruments for smooth and reliable professional procedures.
              </p>
            </div>

            <button 
              onClick={() => navigate("/shop?category=Equipment")} 
              className="mt-5 sm:mt-6 w-full sm:w-fit border border-cyan-500/50 text-cyan-300 hover:bg-[#06A1B7] hover:border-[#06A1B7] hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all text-center"
            >
              View Collection
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;