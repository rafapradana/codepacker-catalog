"use client";

import { useEffect } from "react";

export function DynamicFavicon() {
  useEffect(() => {
    // Function to update favicon based on system theme
    const updateFavicon = () => {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel="icon"]');
      existingFavicons.forEach(favicon => favicon.remove());

      // Create new favicon link
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/svg+xml";
      
      // Check system theme preference directly
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Set favicon based on system theme
      if (isDarkMode) {
        favicon.href = "/images/logos/codepacker-white.svg";
      } else {
        favicon.href = "/images/logos/codepacker-black.svg";
      }
      
      // Add favicon to head
      document.head.appendChild(favicon);
    };

    // Initial favicon setup
    updateFavicon();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => updateFavicon();
    
    // Add event listener for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Cleanup event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return null;
}