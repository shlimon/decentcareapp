import { forwardRef } from 'react';
import BaseInput from './_components/BasicInput';
import { TagInput as TagInputCore } from './_components/TagInput';

const TagInput = forwardRef(({
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
    onExtraChange,
    ...rest
}, ref) => {
    return (
        <BaseInput
            label={label}
            error={error}
            required={required}
            className={className}
            icon={icon}
            name={name}
        >
            <TagInputCore
                ref={ref}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                onExtraChange={onExtraChange}
                {...rest}
            />
        </BaseInput>
    );
});

TagInput.displayName = 'TagInput';
export default TagInput;
