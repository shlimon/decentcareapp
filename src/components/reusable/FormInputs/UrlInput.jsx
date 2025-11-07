import { forwardRef } from 'react';
import TextInput from './TextInput';

const UrlInput = forwardRef((props, ref) => {
    return <TextInput ref={ref} type="url" {...props} />;
});

UrlInput.displayName = 'UrlInput';
export default UrlInput;
