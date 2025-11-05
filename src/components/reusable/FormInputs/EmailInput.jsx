import { forwardRef } from 'react';
import TextInput from './TextInput';

const EmailInput = forwardRef((props, ref) => {
    return <TextInput ref={ref} type="email" {...props} />;
});

EmailInput.displayName = 'EmailInput';
export default EmailInput;
