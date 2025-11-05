import { forwardRef } from 'react';
import BaseInput from './_components/BasicInput';

const TextareaInput = forwardRef(({
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
    rows = 4,
    ...rest
}, ref) => {
    return (
        <BaseInput
            label={label}
            error={error}
            required={required}
            className={className}
            name={name}
        >
            <textarea
                ref={ref}
                name={name}
                rows={rows}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none resize-none disabled:text-gray-500 focus:ring-0"
                {...rest}
            />
        </BaseInput>
    );
});

TextareaInput.displayName = 'TextareaInput';
export default TextareaInput;
