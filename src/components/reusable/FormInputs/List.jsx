import { forwardRef, useState } from 'react';
import BaseInput from './_components/BasicInput';

const List = forwardRef(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      error,
      required,
      disabled,
      className = '',
      data = [],
      displayKey,
      subDisplayKey,
      searchKeys = [],
      placeholder = 'Search...',
      multiple = false,
      cancreate = false,
      onCreateClick,
      createbtnname = 'Add Item',
      emptyMessage = 'No items found',
      persistData,
      setValue,
      ...rest
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Filter data based on search term
    const filteredData = data.filter((item) => {
      if (!searchTerm) return true;
      return searchKeys.some((key) =>
        item[key]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    const handleSelect = (item) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const isSelected = currentValues.some(
          (v) => v[displayKey] === item[displayKey]
        );

        if (isSelected) {
          const newValues = currentValues.filter(
            (v) => v[displayKey] !== item[displayKey]
          );
          onChange({ target: { name, value: newValues } });
        } else {
          onChange({ target: { name, value: [...currentValues, item] } });
        }
      } else {
        onChange({ target: { name, value: item } });
        setIsOpen(false);
      }
    };

    const displayValue = () => {
      if (multiple && Array.isArray(value)) {
        return value.map((item) => item[displayKey]).join(', ');
      }
      return value ? value[displayKey] : '';
    };

    return (
      <BaseInput
        label={label}
        error={error}
        required={required}
        className={className}
        name={name}
      >
        <div className="relative">
          <input
            ref={ref}
            type="text"
            name={name}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={onBlur}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full p-0 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none disabled:text-gray-500 focus:ring-0"
            {...rest}
          />

          {/* Display selected values */}
          {displayValue() && !searchTerm && (
            <div className="text-sm text-gray-900">{displayValue()}</div>
          )}

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
              {cancreate && (
                <button
                  type="button"
                  onClick={onCreateClick}
                  className="w-full px-3 py-2 text-left text-blue-600 border-b border-gray-100 hover:bg-blue-50"
                >
                  {createbtnname}
                </button>
              )}

              {filteredData.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {emptyMessage}
                </div>
              ) : (
                filteredData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="px-3 py-2 border-b cursor-pointer hover:bg-gray-50 border-gray-50 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {item[displayKey]}
                    </div>
                    {subDisplayKey && (
                      <div className="text-sm text-gray-500">
                        {item[subDisplayKey]}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </BaseInput>
    );
  }
);

List.displayName = 'List';
export default List;
