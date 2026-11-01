import React, { useState } from 'react';

interface UserAvatarProps {
  user?: {
    name?: string;
    avatar?: string;
    role?: string;
  } | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Derive initials from name
  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    // Skip titles like Dr. / Prof. if more parts exist
    const filtered = parts.filter(p => !['dr.', 'prof.', 'mr.', 'ms.', 'mrs.'].includes(p.toLowerCase()));
    const target = filtered.length > 0 ? filtered : parts;
    if (target.length === 1) return target[0].substring(0, 2).toUpperCase();
    return (target[0][0] + target[target.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] rounded-lg',
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-9 h-9 text-xs rounded-xl',
    lg: 'w-12 h-12 text-sm rounded-xl',
    xl: 'w-16 h-16 text-lg rounded-2xl',
  };

  const roleGradients = {
    admin: 'from-purple-900 to-indigo-800 text-purple-200 border-purple-500/40',
    faculty: 'from-teal-900 to-emerald-800 text-teal-200 border-teal-500/40',
    student: 'from-emerald-900 to-teal-800 text-emerald-200 border-emerald-500/40',
  };

  const gradientClass = user?.role && roleGradients[user.role as keyof typeof roleGradients]
    ? roleGradients[user.role as keyof typeof roleGradients]
    : roleGradients.student;

  // Render custom image if present and valid
  if (user?.avatar && user.avatar.trim() !== '' && !imageFailed) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'User'}
        onError={() => setImageFailed(true)}
        className={`${sizeClasses[size]} object-cover border border-emerald-500/40 shrink-0 ${className}`}
      />
    );
  }

  // Render clean initials badge without random stock photo
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-tr ${gradientClass} font-bold flex items-center justify-center border shadow-sm shrink-0 select-none ${className}`}
      title={user?.name || 'User Profile'}
    >
      <span>{getInitials(user?.name)}</span>
    </div>
  );
};
