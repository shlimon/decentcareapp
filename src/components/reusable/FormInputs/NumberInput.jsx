import { forwardRef } from 'react';
import TextInput from './TextInput';

const NumberInput = forwardRef(({ min, max, step, ...props }, ref) => {
    return (
        <TextInput
            ref={ref}
            type="number"
            min={min}
            max={max}
            step={step}
            {...props}
        />
    );
});

NumberInput.displayName = 'NumberInput';
export default NumberInput;
