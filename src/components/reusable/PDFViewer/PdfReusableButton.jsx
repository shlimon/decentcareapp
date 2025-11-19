import { memo } from 'react';

const PdfReusableButton = ({
    onClick,
    disabled = false,
    icon: Icon,
    iconColor = 'currentColor',
    iconSize = 16,
    title,
    ...rest
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed duration-300 transition-colors"
            title={title}
            {...rest}
        >
            <Icon size={iconSize} color={iconColor} />
        </button>
    );
};

export default memo(PdfReusableButton);
