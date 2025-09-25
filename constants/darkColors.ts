const DarkColors = {
  // Modern teal-based primary colors (brightened for dark mode)
  primary: '#22D3EE', // cyan-400 - brighter for dark backgrounds
  primaryDark: '#0891B2', // cyan-600 - original light theme primary
  primaryLight: '#67E8F9', // cyan-300
  
  // Sophisticated secondary colors
  secondary: '#0F172A', // slate-900 - deep dark with slight blue tint
  accent: '#10B981', // emerald-500 - medical green
  
  // Status colors optimized for dark mode
  danger: '#F87171', // red-400 - softer red for dark
  warning: '#FBBF24', // amber-400 - brighter amber
  success: '#34D399', // emerald-400 - brighter green
  error: '#F87171', // red-400
  info: '#60A5FA', // blue-400

  // Dark mode text colors with proper contrast
  text: {
    primary: '#F8FAFC', // slate-50 - soft white
    secondary: '#CBD5E1', // slate-300 - light gray
    tertiary: '#94A3B8', // slate-400 - medium gray
    light: '#64748B', // slate-500 - darker gray
    white: '#FFFFFF',
    muted: '#475569' // slate-600 - muted dark
  },

  // Dark layered background system
  background: {
    primary: '#0F172A', // slate-900 - main dark background
    secondary: '#1E293B', // slate-800 - cards and surfaces
    tertiary: '#334155', // slate-700 - elevated surfaces
    accent: '#164E63', // cyan-900 - dark teal accent
    card: '#1E293B', // slate-800 - card background
    surface: '#0F1629' // Custom darker surface
  },

  // Dark mode borders and dividers
  border: '#334155', // slate-700 - visible but subtle
  borderLight: '#475569', // slate-600 - lighter borders
  divider: '#475569', // slate-600
  
  // Utility colors for dark mode
  shadow: '#000000', // Pure black for shadows
  overlay: '#00000060', // 60% black overlay (stronger than light)
  
  // Medical app specific dark colors
  medical: {
    primary: '#22D3EE', // Bright teal for dark
    secondary: '#34D399', // Bright medical green
    accent: '#818CF8', // Light purple for highlights
    background: '#164E63' // Dark teal background
  },

  // Dark mode interactive states
  interactive: {
    hover: '#0891B2', // Darker teal for hover
    pressed: '#0E7490', // Even darker for pressed
    disabled: '#475569', // slate-600
    disabledText: '#64748B' // slate-500
  },

  // Gradient colors optimized for dark mode
  gradient: {
    primary: ['#22D3EE', '#34D399'], // Bright teal to emerald
    secondary: ['#818CF8', '#A78BFA'], // Light blue to purple
    accent: ['#FBBF24', '#F59E0B'] // Bright amber gradient
  }
};

export default DarkColors;