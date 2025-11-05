import { forwardRef } from 'react';
import { LuClock as Clock } from 'react-icons/lu';
import BaseInput from './_components/BasicInput';

const TimeInput = forwardRef(({
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
    min,
    max,
    step,
    ...rest
}, ref) => {
    return (
        <BaseInput
            label={label}
            error={error}
            required={required}
            className={className}
            icon={Clock}
            name={name}
        >
            <input
                ref={ref}
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
                className="w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none disabled:text-gray-500 focus:ring-0"
                {...rest}
            />
        </BaseInput>
    );
});

TimeInput.displayName = 'TimeInput';
export default TimeInput;
