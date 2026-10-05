import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { 
    id: 'cyber-emerald', 
    name: 'Cyber Emerald', 
    icon: '🟢', 
    color: '#10b981', 
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    description: 'Neon Emerald & Cyan dark theme'
  },
  { 
    id: 'royal-amethyst', 
    name: 'Royal Amethyst', 
    icon: '🟣', 
    color: '#a855f7', 
    gradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    description: 'Midnight Violet & Purple theme'
  },
  { 
    id: 'ocean-sapphire', 
    name: 'Ocean Sapphire', 
    icon: '🔵', 
    color: '#3b82f6', 
    gradient: 'linear-gradient(135deg, #3b82f6, #0ea5e9)',
    description: 'Deep Navy & Electric Blue theme'
  },
  { 
    id: 'sunset-amber', 
    name: 'Sunset Amber', 
    icon: '🟠', 
    color: '#f97316', 
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    description: 'Warm Coral & Amber Gold theme'
  },
  { 
    id: 'modern-light', 
    name: 'Modern Light', 
    icon: '☀️', 
    color: '#4f46e5', 
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    description: 'Clean Pearl White & Indigo light theme'
  }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('app-theme') || 'cyber-emerald';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex].id);
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
