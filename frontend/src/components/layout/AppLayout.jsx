import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const AppLayout = () => {
  const location = useLocation();

  // Hide sidebar on landing page, login page, and public verification page
  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname.startsWith('/verify/');

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 font-sans">
      <Navbar />
      <div className="flex-1 flex w-full">
        {!isPublicPage && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${isPublicPage ? '' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
