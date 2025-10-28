const getStatusStyles = (status) => {
    switch (status) {
        case 'scheduled':
            return {
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                badgeBg: 'bg-white',
                badgeText: 'text-gray-800',
                badgeBorder: 'border-gray-300',
            };
        case 'completed':
            return {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                badgeBg: 'bg-green-100',
                badgeText: 'text-green-700',
                badgeBorder: 'border-green-300',
            };
        case 'refused':
            return {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                badgeBg: 'bg-red-100',
                badgeText: 'text-red-600',
                badgeBorder: 'border-red-300',
            };
        case 'not administered':
            return {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                badgeBg: 'bg-yellow-100',
                badgeText: 'text-yellow-700',
                badgeBorder: 'border-yellow-300',
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