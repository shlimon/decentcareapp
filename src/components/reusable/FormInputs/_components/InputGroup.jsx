import { forwardRef } from "react";
import { FaCheck } from "react-icons/fa";

const InputGroup = forwardRef(
  (
    {
      // Core props
      value,
      onChange,
      options = [],

      // Configuration
      type = "checkbox", // 'radio' | 'checkbox'
      multiple = false, // For checkbox: allow multiple selections
      maxChoices = null, // Maximum number of selections (for checkboxes)
      minChoices = null, // Minimum number of selections (for checkboxes)

      // Display
      title,
      description,

      // Layout
      layout = "horizontal", // 'horizontal' | 'vertical' | 'grid'
      columns = 2, // For grid layout

      // Styling
      size = "md", // 'sm' | 'md' | 'lg'
      variant = "default", // 'default' | 'card' | 'button'

      // Validation & State
      required = false,
      disabled = false,

      // Interactive features
      clearable = false,

      // Other props
      name,
      className = "",
      onExtraChange,
      ...props
    },
    ref,
  ) => {
    // Auto-detect multiple mode based on value
    const isValueArray = Array.isArray(value);
    const hasMultipleValues = isValueArray && value.length > 1;

    // Auto-enable multiple if:
    // 1. Value is an array with more than 1 item, OR
    // 2. Multiple is explicitly set to true
    const shouldUseMultiple =
      type === "checkbox" &&
      (multiple || (hasMultipleValues && options.length > 1));

    // Handle selection change
    const handleChange = (optionValue) => {
      if (type === "radio") {
        // Radio button behavior - single selection
        const syntheticEvent = {
          target: {
            value: optionValue,
            name: name,
          },
        };
        onChange(syntheticEvent);
        if (onExtraChange) {
          onExtraChange();
        }
      } else if (type === "checkbox" && !shouldUseMultiple) {
        // Checkbox with single selection - return boolean for boolean values
        let newValue;
        if (typeof optionValue === "boolean") {
          // For boolean options, return the opposite of current state
          newValue = value === optionValue ? false : optionValue;
        } else {
          // For non-boolean options, use original logic
          newValue = value === optionValue ? "" : optionValue;
        }

        const syntheticEvent = {
          target: {
            value: newValue,
            name: name,
          },
        };
        onChange(syntheticEvent);
      } else {
        // Multiple selection (checkbox with multiple=true or auto-detected)
        const normalizedValue = Array.isArray(value)
          ? value
          : value
            ? [value]
            : [];
        let newValue = [...normalizedValue];

        if (newValue.includes(optionValue)) {
          // Remove if already selected
          newValue = newValue.filter((v) => v !== optionValue);
        } else {
          // Add if not selected and within limits
          if (maxChoices === null || newValue.length < maxChoices) {
            newValue.push(optionValue);
          }
        }

        const syntheticEvent = {
          target: {
            value: newValue,
            name: name,
          },
        };
        onChange(syntheticEvent);
      }
    };

    // Handle clear all
    const handleClear = () => {
      let newValue;
      if (type === "checkbox" && shouldUseMultiple) {
        newValue = [];
      } else if (
        type === "checkbox" &&
        options.length === 1 &&
        typeof options[0].value === "boolean"
      ) {
        // For single boolean checkbox, clear to false
        newValue = false;
      } else {
        newValue = "";
      }

      const syntheticEvent = {
        target: {
          value: newValue,
          name: name,
        },
      };
      onChange(syntheticEvent);
    };

    // Size classes
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    // Layout classes
    const layoutClasses = {
      horizontal: "flex flex-wrap gap-4",
      vertical: "flex flex-col gap-2",
      grid: `grid grid-cols-${columns} gap-3`,
    };

    // Input size classes
    const inputSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    // Check if option is selected
    const isSelected = (optionValue) => {
      if (type === "checkbox" && shouldUseMultiple) {
        // Multiple selection mode
        const normalizedValue = Array.isArray(value)
          ? value
          : value
            ? [value]
            : [];
        return normalizedValue.includes(optionValue);
      } else {
        // Single selection mode (radio or single checkbox)
        return value === optionValue;
      }
    };

    // Check if can select more (only relevant for multiple checkboxes)
    const normalizedValue = Array.isArray(value) ? value : value ? [value] : [];
    const canSelectMore =
      type === "radio" ||
      (type === "checkbox" && !shouldUseMultiple) ||
      maxChoices === null ||
      normalizedValue.length < maxChoices;

    // Validation messages
    const getValidationMessage = () => {
      const selectedCount =
        type === "checkbox" && shouldUseMultiple
          ? normalizedValue.length
          : value
            ? 1
            : 0;

      if (required && selectedCount === 0) {
        return "This field is required";
      }
      if (minChoices && selectedCount < minChoices) {
        return `Please select at least ${minChoices} option${minChoices > 1 ? "s" : ""
          }`;
      }
      return null;
    };

    const validationMessage = getValidationMessage();

    // Determine if we should show multiple selection UI features
    const isMultipleMode = type === "checkbox" && shouldUseMultiple;

    return (
      <div className={`w-full ${className}`}>
        {/* Title and Description */}
        {title && (
          <div className="mb-1">
            <div className="font-medium text-gray-900">
              {title}
              {required && <span className="ml-1 text-red-500">*</span>}
            </div>
            {description && (
              <div className="mt-1 text-sm text-gray-600">{description}</div>
            )}
          </div>
        )}

        {/* Clear Button */}
        {clearable && (isMultipleMode ? normalizedValue.length > 0 : value) && (
          <div className="mb-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm underline text-primary hover:text-primary_light"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Options Container */}
        <div className={`${layoutClasses[layout]} ${sizeClasses[size]}`}>
          {options.map((option) => {

            const uniqueIdForLabel = option?.label
              ?.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
            const withNameUniqueId = name + uniqueIdForLabel

            const optionValue =
              typeof option === "object" ? option.value : option;
            const optionLabel =
              typeof option === "object" ? option.label : option;
            const optionDescription =
              typeof option === "object" ? option.description : null;
            const selected = isSelected(optionValue);
            const optionDisabled =
              disabled || (!selected && !canSelectMore && isMultipleMode);


            return (
              <label
                htmlFor={withNameUniqueId}
                key={optionValue}
                className={`
                    ${variant === "card"
                    ? `p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${selected
                      ? "border-primary bg-blue-50"
                      : "border-gray-200"
                    }`
                    : variant === "button"
                      ? `px-4 py-2 border rounded-md cursor-pointer transition-colors ${selected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`
                      : "inline-flex items-center space-x-2 cursor-pointer"
                  }
                    ${optionDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
              >
                {variant === "button" ? (
                  <>
                    <input
                      ref={ref}
                      type={type}
                      id={withNameUniqueId}
                      name={name || title || "input-group"}
                      value={optionValue}
                      checked={selected}
                      onChange={() =>
                        !optionDisabled && handleChange(optionValue)
                      }
                      disabled={optionDisabled}
                      className="hidden"
                      {...props}
                    />
                    <span className={selected ? "text-white" : "text-gray-700"}>
                      {optionLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="relative inline-block">
                      <input
                        ref={ref}
                        type={type}
                        id={withNameUniqueId}
                        name={name || title || "input-group"}
                        value={optionValue}
                        checked={selected}
                        onChange={() =>
                          !optionDisabled && handleChange(optionValue)
                        }
                        disabled={optionDisabled}
                        className={`
                            ${inputSizeClasses[size]}
                            appearance-none
                            -webkit-appearance-none
                            -moz-appearance-none
                            rounded-md
                            border-2
                            border-gray-300
                            bg-white
                            focus:ring-2 
                            focus:ring-primary
                            focus:border-primary
                            ${selected
                            ? "bg-blue-600 border-blue-600"
                            : "hover:border-gray-400"
                          }
                            ${optionDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                          }
                            transition-colors
                            [&:checked]:bg-blue-600
                            [&:checked]:border-blue-600
                            [&:checked]:bg-none
                            `}
                        style={{
                          backgroundImage: "none !important",
                        }}
                        {...props}
                      />
                      {selected && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
                        >
                          <FaCheck className="p-[1.5px] text-[#B0CAD9]" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`pt-0.5 ${variant === "button" && selected ? "text-white" : "text-gray-700"}${optionDisabled ? "text-gray-400" : ""}`}
                    >
                      {optionLabel}
                    </span>
                  </>
                )}
                {optionDescription && (
                  <div className="mt-1 text-xs text-gray-500">
                    {optionDescription}
                  </div>
                )}
              </label>
            );
          })}
        </div>

        {/* Helper Text */}
        {isMultipleMode && maxChoices && (
          <div className="mt-2 text-xs text-gray-500">
            {normalizedValue.length}/{maxChoices} selected
            {maxChoices > 1 && ` (max ${maxChoices})`}
          </div>
        )}

        {/* Validation Error */}
        {validationMessage && (
          <div className="mt-1 text-sm text-red-600">{validationMessage}</div>
        )}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";
export { InputGroup };
