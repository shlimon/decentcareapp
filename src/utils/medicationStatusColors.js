const getStatusStyles = (status) => {
    switch (status) {
        case "Completed":
            return {
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                badgeBg: "bg-green-100",
                badgeText: "text-green-700",
                badgeBorder: "border-green-300",
            };

        case "Approved":
            return {
                bgColor: "bg-teal-50",
                borderColor: "border-teal-200",
                badgeBg: "bg-teal-100",
                badgeText: "text-teal-700",
                badgeBorder: "border-teal-300",
            };

        case "Refused":
            return {
                bgColor: "bg-orange-50",
                borderColor: "border-orange-200",
                badgeBg: "bg-orange-100",
                badgeText: "text-orange-700",
                badgeBorder: "border-orange-300",
            };

        case "Declined":
            return {
                bgColor: "bg-red-50",
                borderColor: "border-red-200",
                badgeBg: "bg-red-100",
                badgeText: "text-red-700",
                badgeBorder: "border-red-300",
            };

        case "Not Administered":
            return {
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
                badgeBg: "bg-yellow-100",
                badgeText: "text-yellow-700",
                badgeBorder: "border-yellow-300",
            };

        case "Requested":
            return {
                bgColor: "bg-indigo-50",
                borderColor: "border-indigo-200",
                badgeBg: "bg-indigo-100",
                badgeText: "text-indigo-700",
                badgeBorder: "border-indigo-300",
            };

        default:
            return {
                bgColor: "bg-gray-50",
                borderColor: "border-gray-200",
                badgeBg: "bg-white",
                badgeText: "text-gray-800",
                badgeBorder: "border-gray-300",
            };
    }
};

export default getStatusStyles;
