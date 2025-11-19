/* eslint-disable no-unused-vars */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <> */
import { forwardRef } from 'react';

const BaseInput = forwardRef(
  (
    {
      label,
      error,
      required,
      className = '',
      icon: IconComponent,
      children,
      name,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        <div ref={ref} className="relative py-1.5 bg-white rounded-lg">
          <div className={`flex items-center ${IconComponent ? 'gap-3' : ''}`}>
            {/* Icon Section */}
            {IconComponent && (
              <div className="flex-shrink-0 pt-6">
                <IconComponent size={20} className="text-gray-400" />
              </div>
            )}

            {/* Input Section */}
            <div className="flex-1">
              {label && (
                <label
                  htmlFor={name}
                  className={`block text-sm font-medium text-gray-700 mb-1 text-left ${required
                      ? "after:content-['*'] after:ml-1 after:text-red-500"
                      : ''
                    }`}
                >
                  {label}
                </label>
              )}
              {children}
            </div>
          </div>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;
