import { forwardRef, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

const TagInput = forwardRef(
    (
        {
            name,
            value = [],
            onChange,
            onBlur,
            placeholder = 'Type and press Enter to add tags',
            disabled = false,
            max = null,
            allowDuplicates = false,
            allowMultiple = true,
            className = '',
            onExtraChange,
            ...rest
        },
        ref
    ) => {
        const [inputValue, setInputValue] = useState('');
        const [tags, setTags] = useState([]);
        const inputRef = useRef(null);

        // Sync with external value changes - fixed to prevent infinite re-renders
        useEffect(() => {
            if (allowMultiple) {
                // For multiple tags, expect array
                const newTags = Array.isArray(value) ? value : (value ? [value] : []);
                setTags(newTags);
            } else {
                // For single tag, convert string to array internally
                const newTags = value ? [value] : [];
                setTags(newTags);
            }
        }, [value, allowMultiple]);

        const handleInputChange = (e) => {
            setInputValue(e.target.value);
        };

        const addTag = (tagText) => {
            const trimmedTag = tagText.trim();

            if (!trimmedTag) return;

            // Check for duplicates if not allowed
            if (!allowDuplicates && tags.includes(trimmedTag)) return;

            // Check max tags limit
            if (max && tags.length >= max) return;

            // For single tag mode, replace existing tag
            const newTags = allowMultiple ? [...tags, trimmedTag] : [trimmedTag];

            setTags(newTags);
            setInputValue('');

            // Trigger onChange for form integration
            if (onChange) {
                if (allowMultiple) {
                    onChange(newTags); // Return array for multiple
                } else {
                    onChange(trimmedTag); // Return string for single
                }
            }
        };

        const removeTag = (indexToRemove) => {
            const newTags = tags.filter((_, index) => index !== indexToRemove);
            setTags(newTags);

            // Trigger onChange for form integration
            if (onChange) {
                if (allowMultiple) {
                    onChange(newTags); // Return array for multiple
                } else {
                    onChange(''); // Return empty string for single
                }
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag(inputValue);
            } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
                // Remove last tag when backspace is pressed on empty input
                removeTag(tags.length - 1);
            }
        };

        const handleInputBlur = (e) => {
            // Add tag on blur if there's text
            if (inputValue.trim()) {
                addTag(inputValue);
            }

            if (onBlur) {
                onBlur(e);
            }
        };

        const focusInput = () => {
            if (inputRef.current && !disabled) {
                inputRef.current.focus();
            }
        };

        // Determine if input should be disabled
        const isInputDisabled = disabled ||
            (max && tags.length >= max) ||
            (!allowMultiple && tags.length >= 1);

        return (
            <div
                className={`min-h-[42px] bg-white cursor-text ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''
                    } ${className}`}
                onClick={focusInput}
            >
                <div className="flex flex-wrap items-center gap-1">
                    {/* Render existing tags */}
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-md"
                        >
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTag(index);
                                    }}
                                    className="flex items-center justify-center w-4 h-4 text-blue-600 transition-colors rounded-full hover:text-blue-800 hover:bg-blue-200"
                                    title="Remove tag"
                                >
                                    <IoClose size={12} />
                                </button>
                            )}
                        </span>
                    ))}

                    {/* Input field */}
                    <input
                        ref={(el) => {
                            inputRef.current = el;
                            if (ref) {
                                if (typeof ref === 'function') {
                                    ref(el);
                                } else {
                                    ref.current = el;
                                }
                            }
                        }}
                        type="text"
                        name={name}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleInputBlur}
                        placeholder={tags.length === 0 ? placeholder : ''}
                        disabled={isInputDisabled}
                        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 disabled:text-gray-500 focus:ring-0 p-0"
                        {...rest}
                    />
                </div>

                {/* Helper text */}
                {max && (
                    <div className="mt-1 text-xs text-gray-500">
                        {tags.length}/{max} tags
                        {!allowMultiple && ' (single tag mode)'}
                    </div>
                )}
            </div>
        );
    }
);

TagInput.displayName = 'TagInput';
export { TagInput };
