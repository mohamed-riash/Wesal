import React, { createContext, useContext, useState } from 'react';

const UserPreferencesContext = createContext();

export function UserPreferencesProvider({ children }) {
  const [quranFontSize, setQuranFontSize] = useState(() => {
    return parseInt(localStorage.getItem('wesal_quran_font_size')) || 24;
  });

  const [toastMessage, setToastMessage] = useState(null);

  const updateQuranFontSize = (size) => {
    const newSize = Math.max(16, Math.min(48, size));
    setQuranFontSize(newSize);
    localStorage.setItem('wesal_quran_font_size', newSize.toString());
  };

  const showToast = (message, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        quranFontSize,
        updateQuranFontSize,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export const useUserPreferences = () => useContext(UserPreferencesContext);
