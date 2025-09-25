const Colors = {
  // Modern teal-based primary colors
  primary: '#0891B2', // Modern cyan-600
  primaryDark: '#0E7490', // cyan-700 
  primaryLight: '#67E8F9', // cyan-300
  
  // Sophisticated secondary colors
  secondary: '#F0F9FF', // cyan-50 - very light teal tint
  accent: '#059669', // emerald-600 - medical green
  
  // Status colors with modern hues
  danger: '#DC2626', // red-600
  warning: '#D97706', // amber-600  
  success: '#059669', // emerald-600
  error: '#DC2626', // red-600
  info: '#2563EB', // blue-600

  // Modern text colors with better contrast
  text: {
    primary: '#111827', // gray-900 - deeper black
    secondary: '#4B5563', // gray-600 - softer gray
    tertiary: '#6B7280', // gray-500 - lighter gray
    light: '#9CA3AF', // gray-400
    white: '#FFFFFF',
    muted: '#D1D5DB' // gray-300
  },

  // Layered background system
  background: {
    primary: '#FFFFFF', // Pure white
    secondary: '#F8FAFC', // slate-50 - subtle cool tint
    tertiary: '#F1F5F9', // slate-100 - slightly deeper
    accent: '#F0F9FF', // cyan-50 - teal tinted
    card: '#FDFDFD', // Off-white for cards
    surface: '#FAFBFC' // Subtle surface color
  },

  // Modern border and divider colors
  border: '#E2E8F0', // slate-200 - softer than gray
  borderLight: '#F1F5F9', // slate-100 - very subtle
  divider: '#E5E7EB', // gray-200
  
  // Additional utility colors
  shadow: '#000000', // For shadows
  overlay: '#00000020', // 20% black overlay
  
  // Medical app specific colors
  medical: {
    primary: '#0891B2', // Main medical teal
    secondary: '#10B981', // Medical green  
    accent: '#6366F1', // Modern purple for highlights
    background: '#F0F9FF' // Light teal background
  },

  // Interactive states
  interactive: {
    hover: '#0E7490', // Darker teal for hover
    pressed: '#0C4A6E', // Even darker for pressed
    disabled: '#CBD5E1', // slate-300
    disabledText: '#94A3B8' // slate-400
  },

  // Gradient colors for modern effects
  gradient: {
    primary: ['#0891B2', '#10B981'], // Teal to emerald
    secondary: ['#6366F1', '#8B5CF6'], // Blue to purple
    accent: ['#F59E0B', '#EAB308'] // Amber gradient
  }
};

export default Colors;