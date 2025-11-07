import { forwardRef } from 'react';
import { LuDollarSign as DollarSign } from 'react-icons/lu';
import NumberInput from './NumberInput';

const CurrencyInput = forwardRef((props, ref) => {
    return (
        <NumberInput
            ref={ref}
            icon={DollarSign}
            min={0}
            step={0.01}
            placeholder="0.00"
            {...props}
        />
    );
});

CurrencyInput.displayName = 'CurrencyInput';
export default CurrencyInput;
