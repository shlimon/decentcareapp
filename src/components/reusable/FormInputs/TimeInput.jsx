import { forwardRef, useRef } from 'react';
import { LuClock as Clock } from 'react-icons/lu';
import BaseInput from './_components/BasicInput';

const TimeInput = forwardRef(
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
      className = '',
      inputClassName = '',
      min,
      max,
      step,
      showClock = true,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef(null);

    const handleClick = () => {
      if (!disabled) {
        const target = ref?.current || inputRef.current;
        if (target && typeof target.showPicker === 'function') {
          target.showPicker(); // opens the native time picker
        } else {
          target?.focus(); // fallback for browsers that don’t support showPicker()
        }
      }
    };

    return (
      <div onClick={handleClick} className="cursor-pointer">
        <BaseInput
          label={label}
          error={error}
          required={required}
          className={className}
          icon={showClock ? Clock : null} // ✅ conditionally show icon
          name={name}
        >
          <input
            ref={(node) => {
              if (ref) {
                if (typeof ref === 'function') ref(node);
                else ref.current = node;
              }
              inputRef.current = node;
            }}
            type="time"
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none disabled:text-gray-500 focus:ring-0 ${inputClassName}`}
            {...rest}
          />
        </BaseInput>
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';
export default TimeInput;
