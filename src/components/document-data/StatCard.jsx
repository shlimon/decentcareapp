const StatCard = ({ title, value, bgColor, valueColor }) => {
   return (
      <div
         className={`border border-gray-300 rounded-xl px-4 py-2 ${bgColor} w-full`}
      >
         <p className="text-xs font-medium text-[#130F26]">{title}</p>
         <p className={`text-xl font-semibold ${valueColor}`}>{value}</p>
      </div>
   );
};

export default StatCard;
