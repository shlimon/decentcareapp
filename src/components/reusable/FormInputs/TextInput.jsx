import { forwardRef } from 'react';
import BaseInput from './_components/BasicInput';

const TextInput = forwardRef(
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
      className = '',
      type = 'text',
      ...rest
    },
    ref,
  ) => {
    const handleWheel = (e) => {
      if (type === 'number') {
        e.target.blur(); // prevent scroll increment/decrement
      }
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
        <input
          ref={ref}
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          onWheel={handleWheel}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none disabled:text-gray-500 focus:ring-0"
          {...rest}
        />
      </BaseInput>
    );
  },
);

TextInput.displayName = 'TextInput';
export default TextInput;
