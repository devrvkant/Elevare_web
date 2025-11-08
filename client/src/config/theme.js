// Theme configuration for consistent styling across the app
const theme = {
  colors: {
    primary: {
      main: '#A855F7', // Purple
      light: '#C084FC',
      dark: '#9333EA',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #8B5CF6 100%)',
    },
    secondary: {
      main: '#3B82F6', // Blue
      light: '#60A5FA',
      dark: '#2563EB',
    },
    accent: {
      main: '#EC4899', // Pink
      light: '#F472B6',
      dark: '#DB2777',
    },
    background: {
      main: '#F9FAFB',
      card: '#FFFFFF',
      hover: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      light: '#9CA3AF',
    },
    border: {
      light: '#E5E7EB',
      main: '#D1D5DB',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  gradients: {
    primary: 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    card: 'bg-gradient-to-br from-white to-gray-50',
    hero: 'bg-gradient-to-br from-pink-50 via-purple-50 to-violet-50',
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },
  spacing: {
    section: 'py-8 md:py-12',
    container: 'px-4 sm:px-6 lg:px-8',
  },
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
};

export default theme;
