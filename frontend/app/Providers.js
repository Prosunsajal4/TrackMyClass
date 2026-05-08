'use client';

import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../context/ThemeContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
