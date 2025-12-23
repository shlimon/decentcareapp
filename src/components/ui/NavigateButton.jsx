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
        <button className="back-btn" onClick={handleClick}>
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
