/* eslint-disable no-unused-vars */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <only ref> */
import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LuChevronDown as ChevronDown,
  LuSearch as Search,
  LuX as X,
} from 'react-icons/lu';

const SearchableSelect = forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      onExtraChange,
      placeholder,
      disabled,
      options = [],
      multiple = false,
      name,
      isSearchable = false,
      baseInputRef,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const selectRef = useRef(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
      if (multiple) {
        if (Array.isArray(value) && value.length > 0) {
          const selected = options.filter((opt) =>
            value.some((val) => val === opt.value)
          );
          setSelectedOptions(selected);
        } else {
          setSelectedOptions([]);
        }
      } else {
        if (value !== undefined && value !== null && value !== '') {
          const option = options.find((opt) => opt.value === value);
          setSelectedOption(option || null);
        } else {
          setSelectedOption(null);
        }
      }
    }, [value, options, multiple]);

    // In SearchableSelect component, replace the positioning useEffect (around line 60-150):

    useEffect(() => {
      if (!isOpen || !selectRef?.current) return;

      const selectElement = selectRef.current;

      const calculatePosition = () => {
        if (!selectElement) return;

        const rect = selectElement.getBoundingClientRect();

        // Calculate actual dropdown height based on content
        const OPTION_HEIGHT = 36; // approximate height per option (py-2 + text)
        const SEARCH_HEIGHT = isSearchable ? 45 : 0; // search input height if present
        const MAX_DROPDOWN_HEIGHT = 240;
        const actualOptionsHeight = Math.min(
          filteredOptions.length * OPTION_HEIGHT,
          192
        ); // max-h-48 = 192px
        const DROPDOWN_HEIGHT = Math.min(
          SEARCH_HEIGHT + actualOptionsHeight + 8, // 8px for padding
          MAX_DROPDOWN_HEIGHT
        );

        const DROPDOWN_WIDTH = rect.width;
        const SPACING_GAP = 4;
        const VIEWPORT_MARGIN = 16;

        // space calculations
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top, left;

        const requiredSpaceWithGap = DROPDOWN_HEIGHT + SPACING_GAP;

        // vertical positioning
        if (spaceBelow >= requiredSpaceWithGap) {
          // position below input
          top = rect.bottom + window.scrollY + SPACING_GAP;
        } else if (spaceAbove >= requiredSpaceWithGap) {
          // position above input
          top = rect.top + window.scrollY - DROPDOWN_HEIGHT - SPACING_GAP;
        } else {
          // use the side with more space
          if (spaceBelow >= spaceAbove) {
            top = Math.min(
              rect.bottom + window.scrollY + SPACING_GAP,
              window.innerHeight +
                window.scrollY -
                DROPDOWN_HEIGHT -
                VIEWPORT_MARGIN
            );
          } else {
            top = Math.max(
              rect.top + window.scrollY - DROPDOWN_HEIGHT - SPACING_GAP,
              window.scrollY + VIEWPORT_MARGIN
            );
          }
        }

        // horizontal positioning
        left = rect.left + window.scrollX;

        setPosition({
          top: Math.round(top),
          left: Math.round(left),
          width: rect.width,
        });
      };

      calculatePosition();

      // event listeners with requestAnimationFrame throttling
      let rafId = null;
      const handlePositionUpdate = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          calculatePosition();
          rafId = null;
        });
      };

      window.addEventListener('resize', handlePositionUpdate);
      window.addEventListener('scroll', handlePositionUpdate, {
        passive: true,
        capture: true,
      });

      if (window.screen?.orientation) {
        window.screen.orientation.addEventListener(
          'change',
          handlePositionUpdate
        );
      }

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        window.removeEventListener('resize', handlePositionUpdate);
        window.removeEventListener('scroll', handlePositionUpdate, {
          passive: true,
          capture: true,
        });
        if (window.screen?.orientation) {
          window.screen.orientation.removeEventListener(
            'change',
            handlePositionUpdate
          );
        }
      };
    }, [isOpen]);

    // handle click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // filter options based on search term
    const filteredOptions = options.filter((option) =>
      option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && isSearchable) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };

    const handleOptionSelect = (option) => {
      if (multiple) {
        const isSelected = selectedOptions.some(
          (selected) => selected.value === option.value
        );
        let newSelectedOptions;

        if (isSelected) {
          newSelectedOptions = selectedOptions.filter(
            (selected) => selected.value !== option.value
          );
        } else {
          newSelectedOptions = [...selectedOptions, option];
        }

        setSelectedOptions(newSelectedOptions);
        setSearchTerm('');
        setIsOpen(false);

        const syntheticEvent = {
          target: {
            name,
            value: newSelectedOptions.map((opt) => opt.value),
          },
        };

        if (onChange) {
          onChange(syntheticEvent);
        }

        if (onExtraChange) {
          onExtraChange(newSelectedOptions.map((opt) => opt.value));
        }
      } else {
        setSelectedOption(option);
        setIsOpen(false);
        setSearchTerm('');

        const syntheticEvent = {
          target: {
            name,
            value: option.value,
          },
        };

        if (onChange) {
          onChange(syntheticEvent);
        }

        if (onExtraChange) {
          onExtraChange(option.value);
        }

        if (onBlur) {
          onBlur(syntheticEvent);
        }
      }
    };

    const handleRemoveOption = (optionToRemove, e) => {
      e.stopPropagation();
      const newSelectedOptions = selectedOptions.filter(
        (selected) => selected.value !== optionToRemove.value
      );
      setSelectedOptions(newSelectedOptions);

      const syntheticEvent = {
        target: {
          name,
          value: newSelectedOptions.map((opt) => opt.value),
        },
      };

      if (onChange) {
        onChange(syntheticEvent);
      }

      if (onExtraChange) {
        onExtraChange(newSelectedOptions.map((opt) => opt.value));
      }
    };

    const handleClear = (e) => {
      e.stopPropagation();

      if (multiple) {
        setSelectedOptions([]);
      } else {
        setSelectedOption(null);
      }
      setSearchTerm('');

      const syntheticEvent = {
        target: {
          name,
          value: multiple ? [] : '',
        },
      };

      if (onChange) {
        onChange(syntheticEvent);
      }

      if (onExtraChange) {
        onExtraChange(multiple ? [] : '');
      }
    };

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredOptions.length > 0) {
          handleOptionSelect(filteredOptions[0]);
        }
      }
    };

    const getDisplayText = () => {
      if (multiple) {
        if (selectedOptions.length === 0) {
          return placeholder || 'Select options';
        }
        if (selectedOptions.length === 1) {
          return selectedOptions[0].label;
        }
        return `${selectedOptions.length} options selected`;
      } else {
        return selectedOption
          ? selectedOption.label
          : placeholder || 'Select an option';
      }
    };

    const getTextColor = () => {
      if (multiple) {
        return selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-400';
      } else {
        return selectedOption ? 'text-gray-900' : 'text-gray-400';
      }
    };

    const hasSelection = multiple
      ? selectedOptions.length > 0
      : selectedOption !== null;

    // Render dropdown as portal
    const renderDropdown = () => {
      if (!isOpen || !mounted || (position.top === 0 && position.left === 0)) {
        return null;
      }

      return createPortal(
        <div
          ref={dropdownRef}
          className="absolute top-0 left-0 z-50 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg max-h-60"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
          }}
        >
          {/* Search input */}
          {isSearchable && (
            <div className="p-2.5 border-b border-gray-200">
              <div className="flex items-center gap-3 rounded">
                <Search size={16} className="text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search"
                  className="w-full p-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = multiple
                  ? selectedOptions.some(
                      (selected) => selected.value === option.value
                    )
                  : selectedOption?.value === option.value;

                return (
                  <div
                    key={
                      option.value !== undefined ? String(option.value) : index
                    }
                    onClick={() => handleOptionSelect(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary_light/10 text-sm flex items-center justify-between duration-300 ${
                      isSelected
                        ? 'bg-primary_light/20 text-primary'
                        : 'text-gray-900'
                    }`}
                  >
                    <span>{option.label}</span>
                    {multiple && isSelected && (
                      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-2 py-1 text-sm text-gray-500">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            )}
          </div>
        </div>,
        document.body
      );
    };

    return (
      <div ref={selectRef} className="flex-1">
        {/* Select trigger */}
        <div
          onClick={handleToggle}
          className={`w-full bg-transparent border-none outline-none text-gray-900 disabled:text-gray-500 cursor-pointer focus:ring-0 p-0 flex items-center justify-between ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex-1 min-w-0">
            {multiple && selectedOptions.length > 1 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((option, index) => (
                  <span
                    key={option.value || index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-primary_light/10 text-primary/90"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(option, e)}
                      className="hover:text-primary"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className={getTextColor()}>{getDisplayText()}</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {hasSelection && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Render dropdown as portal */}
        {renderDropdown()}
      </div>
    );
  }
);

SearchableSelect.displayName = 'SearchableSelect';
export { SearchableSelect };
