import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'eazetrip_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('exploreeaz_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (credentials) => {
    const apiRes = await api.login(credentials);
    let loggedInUser = null;

    if (apiRes.ok && apiRes.data?.data) {
      loggedInUser = apiRes.data.data;
    } else {
      // Fallback in offline / simulated mode
      const { identifier, method } = credentials;
      if (method === 'phone') {
        loggedInUser = {
          id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
          name: 'Traveler ' + identifier.slice(-4),
          phone: identifier,
          email: `user${identifier.slice(-4)}@eazetrip.com`,
          memberSince: new Date().getFullYear(),
          tier: 'Silver Member'
        };
      } else {
        const namePart = identifier.split('@')[0];
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        loggedInUser = {
          id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
          name: displayName,
          email: identifier,
          phone: '+91 9876543210',
          memberSince: new Date().getFullYear(),
          tier: 'Gold Member'
        };
      }
    }

    setUser(loggedInUser);
    setIsLoginModalOpen(false);
    return { success: true, user: loggedInUser };
  };

  const loginWithGoogle = async () => {
    const googleUser = {
      id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
      name: 'Priyansh Sharma',
      email: 'priyansh.sharma@gmail.com',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      memberSince: new Date().getFullYear(),
      tier: 'Gold Member',
      authProvider: 'Google'
    };
    setUser(googleUser);
    setIsLoginModalOpen(false);
    return { success: true, user: googleUser };
  };

  const register = async (userData) => {
    const apiRes = await api.register(userData);
    let newUser = null;

    if (apiRes.ok && apiRes.data?.data) {
      newUser = apiRes.data.data;
    } else {
      newUser = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        name: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        phone: userData.phone || '+91 9876543210',
        memberSince: new Date().getFullYear(),
        tier: 'Classic Member'
      };
    }

    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updatedFields) => {
    setUser((prev) => {
      const merged = prev ? { ...prev, ...updatedFields } : updatedFields;
      // Sync with backend asynchronously
      api.updateProfile(merged).catch((err) => console.warn('Could not sync profile to backend:', err));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
