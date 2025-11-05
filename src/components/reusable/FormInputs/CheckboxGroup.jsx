import { forwardRef } from 'react';
import { InputGroup } from './_components/InputGroup';

const CheckboxGroup = forwardRef(({
    name,
    label,
    value,
    onChange,
    onBlur,
    error,
    required,
    disabled,
    className = '',
    options = [],
    multiple = true,
    ...rest
}, ref) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor=''
                    className={`block text-sm font-medium text-gray-700 mb-2 ${required
                        ? "after:content-['*'] after:ml-1 after:text-red-500"
                        : ''
                        }`}
                >
                    {label}
                </label>
            )}

            <InputGroup
                ref={ref}
                type="checkbox"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                options={options}
                error={error}
                disabled={disabled}
                multiple={multiple}
                {...rest}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

CheckboxGroup.displayName = 'CheckboxGroup';
export default CheckboxGroup;
