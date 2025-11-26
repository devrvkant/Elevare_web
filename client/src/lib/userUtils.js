/**
 * Get user initials from display name or email
 */
export const getUserInitials = (user) => {
  if (user?.displayName) {
    return user.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (user?.email) {
    return user.email.slice(0, 2).toUpperCase();
  }

  return 'U';
};

/**
 * Get a consistent color based on user email
 */
export const getUserColor = (user) => {
  return 'bg-primary text-primary-foreground';
};

/**
 * Get user avatar URL or fallback to UI Avatars
 */
export const getUserAvatar = (user, useGooglePhoto = true) => {
  // If we want to use Google photo and it exists
  if (useGooglePhoto && user?.photoURL) {
    return user.photoURL;
  }

  // Fallback to UI Avatars
  const name = user?.displayName || user?.email || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;
};
