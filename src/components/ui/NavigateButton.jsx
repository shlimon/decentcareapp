import React from "react";
import { useNavigate } from "react-router-dom";

function NavigateButton({
    navigateUrl,
    title,
    icon: Icon,
    iconPosition = "left"
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(navigateUrl);
    };

    return (
        <button className="bg-gray-100 text-gray-600 border border-gray-300 px-4 py-2 rounded-md text-sm mb-5 inline-flex items-center gap-2 font-sans transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-800 cursor-pointer" onClick={handleClick}>
            {iconPosition === "left" && Icon && (
                <span className="btn-icon left">
                    <Icon size={16} />
                </span>
            )}

            <span className="btn-text">{title}</span>

            {iconPosition === "right" && Icon && (
                <span className="btn-icon right">
                    <Icon size={16} />
                </span>
            )}
        </button>
    );
}

export default NavigateButton;
