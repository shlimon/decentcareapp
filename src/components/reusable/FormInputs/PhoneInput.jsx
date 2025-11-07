import { forwardRef } from 'react';
import TextInput from './TextInput';

const PhoneInput = forwardRef((props, ref) => {
  return <TextInput ref={ref} type="tel" icon={props.icon} {...props} />;
});

PhoneInput.displayName = 'PhoneInput';
export default PhoneInput;
