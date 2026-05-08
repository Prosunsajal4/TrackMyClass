'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="md:ml-64">
        <Header title={title} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
