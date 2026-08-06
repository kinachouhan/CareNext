import { ArrowUpRight } from "lucide-react";

const AnalyticsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            {value}
          </h2>
          <div className="flex items-center gap-2 mt-6">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <ArrowUpRight size={14} />
              {change}
            </div>
            <span className="text-gray-400 text-sm">
              this month
            </span>
          </div>
        </div>

        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon className="text-white" size={28} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;