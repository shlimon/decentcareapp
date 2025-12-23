const statusStyles = {
    "Not started": "bg-gray-100 text-gray-700",
    "Under Investigation": "bg-blue-100 text-blue-700",
    "Pending Approval": "bg-yellow-100 text-yellow-700",
    "Completed": "bg-green-100 text-green-700"
};

const StatusBadge = ({ status }) => {
    return (
        <span
            className={`px-3 py-1 text-xs font-semibold rounded-full text-nowrap ${statusStyles[status] || "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
};

export default StatusBadge