import { forwardRef, useRef } from 'react';
import BaseInput from './_components/BasicInput';
import { SearchableSelect } from './_components/SearchableSelect';

const SelectInput = forwardRef(({
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
    options = [],
    multiple = false,
    isSearchable = false,
    ...rest
}, ref) => {
    const baseInputRef = useRef(null);

    return (
        <BaseInput
            ref={baseInputRef}
            label={label}
            error={error}
            required={required}
            className={className}
            icon={icon}
            name={name}
        >
            <SearchableSelect
                ref={ref}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                options={options}
                multiple={multiple}
                isSearchable={isSearchable}
                baseInputRef={baseInputRef}
                {...rest}
            />
        </BaseInput>
    );
});

SelectInput.displayName = 'SelectInput';
export default SelectInput;