/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#00f2ff';
const tintColorDark = '#00f2ff';

export default {
  light: {
    text: '#0f172a',
    background: '#ffffff',
    tint: tintColorLight,
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#f8fafc',
    background: '#0f172a',
    tint: tintColorDark,
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    // Solo Leveling Operator OS Colors
    primary: '#00f2ff', // Neon Cyan
    secondary: '#0ea5e9', // Sky Blue
    accent: '#06b6d4', // Cyan
    surface: '#1e293b', // Slate 800
    surfaceVariant: '#334155', // Slate 700
    backgroundVariant: '#020617', // Slate 950
    border: '#475569', // Slate 600
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    // XP and Level Colors
    xpBar: '#00f2ff',
    xpBackground: '#1e293b',
    levelUp: '#fbbf24', // Amber 400
  },
};
