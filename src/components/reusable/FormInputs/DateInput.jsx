/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: <> */
import { forwardRef, useRef, useState } from "react";
import BaseInput from "./_components/BasicInput";
import { CalendarPicker } from "./_components/CalendarPicker";

const DateInput = forwardRef(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      required,
      disabled,
      icon,
      className = "",
      isEndTime = false,
      ...rest
    },
    ref,
  ) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const inputRef = useRef(null);
    const baseInputRef = useRef(null);

    // combine refs if external ref is provided
    const combinedRef = (node) => {
      inputRef.current = node;
      if (ref) {
        if (typeof ref === "function") {
          ref(node);
        } else {
          ref.current = node;
        }
      }
    };

    const formatDisplayDate = (dateValue) => {
      if (!dateValue) return "";
      try {
        const date = new Date(dateValue);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return dateValue;
      }
    };

    const handleCalendarClick = () => {
      if (!disabled) {
        setShowDatePicker(!showDatePicker);
      }
    };

    const handleKeyDown = (e) => {
      // Open calendar on Enter or Space
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        setShowDatePicker(!showDatePicker);
      }
      // Close calendar on Escape
      if (e.key === "Escape" && showDatePicker) {
        setShowDatePicker(false);
      }
    };

    return (
      <div className={`w-full ${className}`}>
        <BaseInput
          ref={baseInputRef}
          label={label}
          error={error}
          required={required}
          icon={icon}
          name={name}
        >
          <input
            ref={combinedRef}
            type="text"
            name={name}
            value={formatDisplayDate(value)}
            placeholder={placeholder || "Select date"}
            disabled={disabled}
            readOnly
            onClick={handleCalendarClick}
            onKeyDown={handleKeyDown}
            className={`w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none cursor-pointer focus:ring-0 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            aria-haspopup="dialog"
            aria-expanded={showDatePicker}
            aria-label={label || "Select date"}
            {...rest}
          />

          <CalendarPicker
            value={value}
            onChange={onChange}
            onClose={() => setShowDatePicker(false)}
            isOpen={showDatePicker}
            isEndTime={isEndTime}
            inputRef={inputRef}
            baseInputRef={baseInputRef}
          />
        </BaseInput>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";
export default DateInput;
