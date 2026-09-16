import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Tag,
  Plane,
  AlertTriangle,
  Info,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Mail,
  ChevronRight,
  X
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    openPreview
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trip') return n.category === 'trip';
    if (activeFilter === 'offer') return n.category === 'offer';
    if (activeFilter === 'alert') return n.category === 'alert' || n.category === 'system';
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'trip':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-emerald-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-sky-600" />;
    }
  };

  const handleActionClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div className="notif-center-wrapper" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="notification-bell-btn"
        className={`notif-bell-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications & Updates"
      >
        <Bell className="notif-bell-icon" size={17} />
        {unreadCount > 0 && (
          <span className="notif-badge-count">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out Flyout Panel */}
      {isOpen && (
        <div className="notif-flyout-panel animate-scale-up shadow-2xl">
          {/* Header */}
          <div className="notif-header">
            <div className="notif-header-title-group">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="notif-title">Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <span className="notif-unread-pill">{unreadCount} New</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  className="notif-mark-read-all-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                className="notif-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="notif-filters-row">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'trip', label: 'Trips & PNR', count: notifications.filter((n) => n.category === 'trip').length },
              { id: 'offer', label: 'Offers', count: notifications.filter((n) => n.category === 'offer').length },
              { id: 'alert', label: 'Alerts', count: notifications.filter((n) => n.category === 'alert' || n.category === 'system').length }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`notif-filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
                {tab.count > 0 && <span className="tab-count">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="notif-feed-list custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="notif-empty-state">
                <Bell className="w-10 h-10 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No notifications found</p>
                <p className="text-xs text-slate-400">You're all caught up with your travel alerts.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item-card ${!notif.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notif-item-top">
                    <div className="flex items-center gap-2">
                      <span className="notif-cat-icon-badge">
                        {getCategoryIcon(notif.category)}
                      </span>
                      <h4 className="notif-item-title">{notif.title}</h4>
                    </div>
                    {!notif.read && <span className="notif-unread-dot" />}
                  </div>

                  <p className="notif-item-desc">{notif.message}</p>

                  {/* Channel Delivery Footnote */}
                  <div className="notif-channels-bar">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <span>Dispatched via:</span>
                      {notif.channelsDelivered?.includes('email') && (
                        <span
                          className="channel-chip email"
                          title="Preview HTML Email"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreview(notif.category === 'offer' ? 'reengagement_inactivity' : 'booking_confirmation', 'email');
                          }}
                        >
                          <Mail className="w-3 h-3 inline mr-0.5" /> Email
                        </span>
                      )}
                      {notif.channelsDelivered?.includes('whatsapp') && (
                        <span
                          className="channel-chip whatsapp"
                          title="Preview WhatsApp Message"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreview(notif.category === 'offer' ? 'reengagement_inactivity' : 'booking_confirmation', 'whatsapp');
                          }}
                        >
                          <MessageSquare className="w-3 h-3 inline mr-0.5" /> WhatsApp
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {notif.actionUrl && (
                    <div className="notif-action-row">
                      <button
                        className="notif-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(notif);
                        }}
                      >
                        <span>{notif.actionLabel || 'View Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="notif-footer-bar">
            <button
              className="notif-manage-hub-link"
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
            >
              <span>Manage Notifications & Live Queue</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
