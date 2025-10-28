import React from "react";
import { FiCheck } from 'react-icons/fi';

const CircularProgress = ({ progress, isComplete }) => {
    const radius = 50;
    const strokeWidth = 6;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        stroke="#e5e7eb"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress circle */}
                    <circle
                        stroke={isComplete ? "#10b981" : "#3b82f6"}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-300 ease-out"
                    />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isComplete ? (
                        <FiCheck className="w-8 h-8 text-green-500" />
                    ) : (
                        <span className="text-xl font-bold text-gray-700">
                            {Math.round(progress)}%
                        </span>
                    )}
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                    {isComplete ? 'Upload Complete!' : 'Uploading...'}
                </p>
                <p className="text-xs text-gray-500">
                    {isComplete ? 'Your document has been uploaded successfully' : 'Please wait while we process your file'}
                </p>
            </div>
        </div>
    );
};

export default React.memo(CircularProgress)