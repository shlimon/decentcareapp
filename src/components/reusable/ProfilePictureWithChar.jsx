export const ProfilePictureWithChar = ({
  name = '',
  avatar = '',
  size = 'md',
}) => {
  const URL = import.meta.env.VITE_DIGITALOCEAN_SPACES_URL;
  const getInitials = (name) => {
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length === 0) return 'N/A';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  };

  const hasAvatar = !!avatar;
  const hasValidName = !!name?.trim();
  const initials = hasValidName ? getInitials(name) : 'N/A';

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  const textSize = textSizeClasses[size] || textSizeClasses.md;

  return hasAvatar ? (
    <img
      src={URL + avatar}
      alt={hasValidName ? name : 'Avatar'}
      className="object-cover w-full h-full border border-gray-500 rounded-full"
    />
  ) : (
    <div
      className={`flex items-center justify-center w-full h-full rounded-full border border-gray-500 bg-gray-200 text-gray-600 font-bold ${textSize}`}
    >
      <span className="block leading-none">{initials}</span>
    </div>
  );
};
