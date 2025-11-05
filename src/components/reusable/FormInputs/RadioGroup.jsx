import { forwardRef } from 'react';
import { InputGroup } from './_components/InputGroup';

const RadioGroup = forwardRef(
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
         options = [],
         title,
         isOptionsAreVertical = false, // Default to horizontal for radio buttons
         ...rest
      },
      ref
   ) => {
      // Map isOptionsAreVertical to InputGroup's layout prop
      const layout = isOptionsAreVertical ? 'vertical' : 'horizontal';

      return (
         <div className={`w-full ${className}`}>
            {label && (
               <label
                  htmlFor={name}
                  className={`test block text-sm font-medium text-gray-700 mb-2 ${
                     required
                        ? "after:content-['*'] after:ml-1 after:text-red-500"
                        : ''
                  }`}
               >
                  {label}
               </label>
            )}

            <InputGroup
               ref={ref}
               type="radio"
               name={name}
               value={value}
               onChange={onChange}
               onBlur={onBlur}
               options={options}
               title={title}
               error={error}
               disabled={disabled}
               layout={layout}
               {...rest}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
         </div>
      );
   }
);

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
