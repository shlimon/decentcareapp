const getStatusStyles = (status) => {
    switch (status) {
        case 'Completed':
            return {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                badgeBg: 'bg-green-100',
                badgeText: 'text-green-700',
                badgeBorder: 'border-green-300',
            };
        case 'Refused':
            return {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                badgeBg: 'bg-red-100',
                badgeText: 'text-red-600',
                badgeBorder: 'border-red-300',
            };
        case 'Not Administered':
            return {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                badgeBg: 'bg-yellow-100',
                badgeText: 'text-yellow-700',
                badgeBorder: 'border-yellow-300',
            };
        case 'Approved':
            return {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                badgeBg: 'bg-blue-100',
                badgeText: 'text-blue-700',
                badgeBorder: 'border-blue-300',
            };

        case 'Declined':
            return {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                badgeBg: 'bg-red-100',
                badgeText: 'text-red-700',
                badgeBorder: 'border-red-300',
            };
        case 'Requested':
            return {
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                badgeBg: 'bg-orange-100',
                badgeText: 'text-orange-700',
                badgeBorder: 'border-orange-300',
            };

        default:
            return {
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                badgeBg: 'bg-white',
                badgeText: 'text-gray-800',
                badgeBorder: 'border-gray-300',
            };
    }
};

export default getStatusStyles;