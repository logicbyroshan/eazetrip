import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || 'USR-1';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [queueStatus, setQueueStatus] = useState(null);
  const [preferences, setPreferences] = useState({
    email: true,
    whatsapp: true,
    sms: false,
    push: true,
    tripUpdates: true,
    promotionalOffers: true,
    priceDropAlerts: true
  });
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    type: 'reengagement_inactivity',
    channel: 'whatsapp', // 'whatsapp' | 'email'
    data: null,
    renderedContent: null
  });

  // Fetch notifications for user
  const fetchNotifications = useCallback(async (filterCategory = 'all') => {
    try {
      const res = await api.getNotifications({
        userId,
        category: filterCategory === 'all' ? '' : filterCategory
      });
      if (res.data) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
    }
  }, [userId]);

  // Fetch queue status
  const refreshQueueStatus = useCallback(async () => {
    try {
      const data = await api.getQueueStatus();
      if (data) {
        setQueueStatus(data);
      }
    } catch (e) {
      console.warn('Failed to fetch queue status:', e);
    }
  }, []);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    try {
      const prefs = await api.getNotificationPreferences(userId);
      if (prefs) setPreferences(prefs);
    } catch (e) {
      console.warn('Failed to fetch notification preferences:', e);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    refreshQueueStatus();
    fetchPreferences();

    // Polling interval for live queue updates
    const interval = setInterval(() => {
      fetchNotifications();
      refreshQueueStatus();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchNotifications, refreshQueueStatus, fetchPreferences]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.warn('Mark read error:', e);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.warn('Mark all read error:', e);
    }
  };

  // Trigger personalized campaign
  const triggerCampaign = async (campaignType, customData = {}) => {
    setLoading(true);
    try {
      const res = await api.triggerCampaign({
        campaignType,
        user: {
          id: userId,
          name: user?.name || 'Priyansh Sharma',
          email: user?.email || 'priyansh.sharma@gmail.com',
          phone: user?.phone || '+91 98765 43210'
        },
        customData
      });
      await fetchNotifications();
      await refreshQueueStatus();
      setLoading(false);
      return res;
    } catch (e) {
      setLoading(false);
      console.error('Trigger campaign error:', e);
      throw e;
    }
  };

  // Retry failed notifications in Dead-Letter Queue
  const retryFailed = async (id = 'all') => {
    setLoading(true);
    try {
      const res = await api.retryFailedNotifications(id);
      await refreshQueueStatus();
      setLoading(false);
      return res;
    } catch (e) {
      setLoading(false);
      console.error('Retry failed error:', e);
      throw e;
    }
  };

  // Save preferences
  const updatePreferences = async (newPrefs) => {
    try {
      setPreferences(newPrefs);
      await api.updateNotificationPreferences(userId, newPrefs);
    } catch (e) {
      console.warn('Update preferences error:', e);
    }
  };

  // Open Preview Modal for WhatsApp / Email
  const openPreview = async (type = 'reengagement_inactivity', channel = 'whatsapp', customData = null) => {
    try {
      const templates = await api.getNotificationTemplates({
        type,
        name: user?.name || 'Priyansh Sharma',
        monthsInactive: customData?.monthsInactive || 3,
        promoCode: customData?.promoCode || 'HOLIDAY25'
      });

      setPreviewModal({
        isOpen: true,
        type,
        channel,
        data: customData,
        renderedContent: templates ? (channel === 'email' ? templates.email : templates.whatsapp) : ''
      });
    } catch (e) {
      console.warn('Open preview error:', e);
    }
  };

  const closePreview = () => {
    setPreviewModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        queueStatus,
        preferences,
        loading,
        previewModal,
        fetchNotifications,
        refreshQueueStatus,
        markAsRead,
        markAllAsRead,
        triggerCampaign,
        retryFailed,
        updatePreferences,
        openPreview,
        closePreview,
        setPreviewModal
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
