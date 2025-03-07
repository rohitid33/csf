import React from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Link } from 'wouter';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminUser, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/admin-login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <nav className="hidden md:flex space-x-4">
              <Link href="/admin-dashboard">
                <a className="hover:text-indigo-200 transition-colors">Dashboard</a>
              </Link>
              <Link href="/admin-dashboard/tickets">
                <a className="hover:text-indigo-200 transition-colors">Tickets</a>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {adminUser && (
              <span className="text-sm hidden md:inline-block">
                Logged in as: {adminUser.username}
              </span>
            )}
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-indigo-800 rounded hover:bg-indigo-900 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;