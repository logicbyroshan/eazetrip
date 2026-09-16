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

  const [rememberedName, setRememberedName] = useState(() => {
    try {
      return localStorage.getItem('eazetrip_remembered_name') || '';
    } catch {
      return '';
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      if (user.name) {
        const first = user.name.trim().split(' ')[0];
        localStorage.setItem('eazetrip_remembered_name', first);
        setRememberedName(first);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const firstName = user?.name ? user.name.trim().split(' ')[0] : (rememberedName || '');

  const getPersonalizedTitle = (baseTitle, customSuffix = '') => {
    if (firstName) {
      if (baseTitle.toLowerCase().includes('for you')) {
        return `${baseTitle}, ${firstName}${customSuffix ? ` — ${customSuffix}` : ''}`;
      }
      return `${baseTitle} for ${firstName}${customSuffix ? ` — ${customSuffix}` : ''}`;
    }
    return customSuffix ? `${baseTitle} — ${customSuffix}` : baseTitle;
  };

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
    if (loggedInUser.name) {
      const first = loggedInUser.name.trim().split(' ')[0];
      localStorage.setItem('eazetrip_remembered_name', first);
      setRememberedName(first);
    }
    setIsLoginModalOpen(false);
    return { success: true, user: loggedInUser };
  };

  const [googleConfig, setGoogleConfig] = useState({
    configured: false,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    mode: 'simulation'
  });

  // Load Google Client ID from backend or Vite env
  useEffect(() => {
    let isMounted = true;
    api.getGoogleClientId().then((cfg) => {
      if (isMounted && cfg) {
        setGoogleConfig({
          configured: cfg.configured || Boolean(cfg.clientId && !cfg.clientId.includes('your_google_client_id')),
          clientId: cfg.clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          mode: cfg.mode || 'simulation'
        });
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Initialize Google Identity Services when script is ready
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initGis = () => {
      if (window.google?.accounts?.id && googleConfig.clientId && !googleConfig.clientId.includes('your_google_client_id')) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleConfig.clientId,
            callback: (response) => {
              if (response?.credential) {
                loginWithGoogle({ credential: response.credential });
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });
        } catch (e) {
          console.warn('[Google GIS] Initialization warning:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGis();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGis();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [googleConfig.clientId]);

  const loginWithGoogle = async (googleParam) => {
    let loggedInUser = null;
    let authPayload = {};

    if (typeof googleParam === 'object' && googleParam !== null) {
      authPayload = googleParam;
    } else if (typeof googleParam === 'string' && googleParam.startsWith('eyJ')) {
      authPayload = { credential: googleParam };
    } else {
      const customName = typeof googleParam === 'string' ? googleParam : 'Priyansh Sharma';
      authPayload = {
        name: customName,
        email: `${customName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`
      };
    }

    // Call backend Google Auth endpoint
    const apiRes = await api.googleAuth(authPayload);

    if (apiRes.ok && apiRes.data?.data) {
      loggedInUser = apiRes.data.data;
    } else {
      // Robust fallback in case of simulated / offline mode
      const resolvedName = authPayload.name || 'Priyansh Sharma';
      const resolvedEmail = authPayload.email || `${resolvedName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
      loggedInUser = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        name: resolvedName,
        email: resolvedEmail,
        phone: '+91 9876543210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        memberSince: new Date().getFullYear(),
        tier: 'Gold Member',
        authProvider: 'Google'
      };
    }

    setUser(loggedInUser);
    if (loggedInUser.name) {
      const first = loggedInUser.name.trim().split(' ')[0];
      localStorage.setItem('eazetrip_remembered_name', first);
      setRememberedName(first);
    }
    setIsLoginModalOpen(false);
    return { success: true, user: loggedInUser };
  };

  const register = async (userData) => {
    const apiRes = await api.register(userData);
    let newUser = null;

    if (apiRes.ok && apiRes.data?.data) {
      newUser = apiRes.data.data;
    } else {
      const resolvedName = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Traveler';
      newUser = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        name: resolvedName,
        email: userData.email,
        phone: userData.phone || '+91 9876543210',
        memberSince: new Date().getFullYear(),
        tier: 'Classic Member'
      };
    }

    setUser(newUser);
    if (newUser.name) {
      const first = newUser.name.trim().split(' ')[0];
      localStorage.setItem('eazetrip_remembered_name', first);
      setRememberedName(first);
    }
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updatedFields) => {
    setUser((prev) => {
      const merged = prev ? { ...prev, ...updatedFields } : updatedFields;
      if (merged.name) {
        const first = merged.name.trim().split(' ')[0];
        localStorage.setItem('eazetrip_remembered_name', first);
        setRememberedName(first);
      }
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
        firstName,
        rememberedName,
        getPersonalizedTitle,
        login,
        loginWithGoogle,
        googleConfig,
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
