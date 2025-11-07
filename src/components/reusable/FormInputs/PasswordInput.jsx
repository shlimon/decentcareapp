import { forwardRef, useState } from 'react';
import { LuEye as Eye, LuEyeOff as EyeOff } from 'react-icons/lu';
import BaseInput from './_components/BasicInput';

const PasswordInput = forwardRef(({
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
    className = '',
    showPasswordToggle = true,
    ...rest
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <BaseInput
            label={label}
            error={error}
            required={required}
            className={className}
            icon={icon}
            name={name}
        >
            <div className="flex items-center">
                <input
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none disabled:text-gray-500 focus:ring-0"
                    {...rest}
                />

                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="flex-shrink-0 p-1 ml-2 text-gray-400 transition-colors hover:text-gray-600"
                        disabled={disabled}
                        title={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </BaseInput>
    );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
