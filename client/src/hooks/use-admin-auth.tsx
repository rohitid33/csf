import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminLoading: boolean;
  adminError: string | null;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setAdminLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/admin-auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAdminUser(res.data.admin);
        setIsAdminAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('adminToken');
        setAdminError('Session expired. Please log in again.');
      } finally {
        setAdminLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const adminLogin = async (username: string, password: string) => {
    setAdminLoading(true);
    setAdminError(null);
    
    try {
      const res = await axios.post('/api/admin-auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      setAdminUser(res.data.admin);
      setIsAdminAuthenticated(true);
    } catch (error: any) {
      setAdminError(error.response?.data?.message || 'Login failed');
      setIsAdminAuthenticated(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        adminUser, 
        adminLoading, 
        adminError, 
        adminLogin, 
        adminLogout, 
        isAdminAuthenticated 
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};