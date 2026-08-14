import { ArrowUpRight } from "lucide-react";
import React, { memo } from "react";

const AnalyticsCard = memo(({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:border-gray-200 hover:-translate-y-1.5 transition-all duration-300 p-6 overflow-hidden flex flex-col justify-between h-full">
      
      {/* Subtle glowing background accent matching the card theme color */}
      <div 
        className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-2xl pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className="overflow-hidden space-y-1">
          <p className="text-gray-400 text-xs font-extrabold uppercase tracking-widest">
            {title}
          </p>
          
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight truncate pt-1">
            {value}
          </h2>
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 10px 20px -5px ${color}40` 
          }}
        >
          <Icon className="text-white stroke-[2.2]" size={26} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 mt-auto flex-wrap relative z-10">
        <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-xs">
          <ArrowUpRight size={14} className="stroke-[2.5]" />
          <span>{change}</span>
        </div>
        <span className="text-gray-400 text-xs font-semibold tracking-wide">
          vs last month
        </span>
      </div>
    </div>
  );
});

AnalyticsCard.displayName = "AnalyticsCard";

export default AnalyticsCard;