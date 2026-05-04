import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { authClient, signIn } from '../lib/auth-client';

const useLogin = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);

      if (!executeRecaptcha) {
        setError('reCAPTCHA not yet loaded. Please try again.');
        return;
      }

      let captchaToken;
      try {
        captchaToken = await executeRecaptcha('login');
      } catch (e) {
        setError('reCAPTCHA failed to execute. Please refresh and try again.');
        toast.error('reCAPTCHA failed to execute');
        return;
      }

      const { error: authError } = await signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: '/',
        },
        {
          headers: {
            'x-captcha-response': captchaToken,
          },
        },
      );

      if (authError) {
        if (authError.status === 403 && authError.message === 'PASSWORD_CHANGE_REQUIRED') {
          toast.error('Password change required');
          navigate('/change-password');
        } else {
          setError(authError.message || 'Login failed');
          toast.error(authError.message || 'Login failed');
        }
        return;
      }

      navigate('/');
      toast.success('Login successful');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);

      if (!executeRecaptcha) {
        toast.error('reCAPTCHA not yet loaded');
        return;
      }

      let captchaToken;
      try {
        captchaToken = await executeRecaptcha('reset_password');
      } catch (e) {
        toast.error('reCAPTCHA failed to execute');
        return;
      }

      const { error: authError } = await authClient.resetPassword(
        { newPassword, token },
        { headers: { 'x-captcha-response': captchaToken } },
      );

      if (authError) {
        toast.error(authError.message || 'Failed to reset password');
        return;
      }

      toast.success('Password reset successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const forgetPassword = async (email) => {
    try {
      setLoading(true);

      if (!executeRecaptcha) {
        toast.error('reCAPTCHA not yet loaded');
        return;
      }

      let captchaToken;
      try {
        captchaToken = await executeRecaptcha('forget_password');
      } catch (e) {
        toast.error('reCAPTCHA failed to execute');
        return;
      }

      const { error: authError } = await authClient.requestPasswordReset(
        { email },
        { headers: { 'x-captcha-response': captchaToken } },
      );

      if (authError) {
        toast.error(authError.message || 'Failed to send reset email');
        return;
      }

      toast.success('Password reset email sent! Please check your inbox.');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, resetPassword, forgetPassword, error, loading };
};

export default useLogin;