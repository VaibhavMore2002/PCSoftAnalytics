import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('isDark');
        return saved ? JSON.parse(saved) : true; // Default to dark mode
    });

    const [palette, setPalette] = useState(() => {
        return localStorage.getItem('palette') || 'default';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Handle Dark Mode
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('isDark', JSON.stringify(isDark));

        // Handle Palette
        root.setAttribute('data-palette', palette);
        localStorage.setItem('palette', palette);
    }, [isDark, palette]);

    const toggleDark = () => setIsDark(prev => !prev);

    const changePalette = (newPalette) => {
        setPalette(newPalette);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleDark, palette, changePalette }}>
            {children}
        </ThemeContext.Provider>
    );
};
