import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/NotificationSystem.css';

const NotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // Set up real-time notification polling
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with actual API call
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const generateMockNotifications = () => {
    const baseNotifications = [];
    const now = new Date();

    if (user?.role === 'admin') {
      // Admin notifications
      baseNotifications.push(
        {
          id: '1',
          type: 'alert',
          category: 'system',
          title: 'High Churn Rate Alert',
          message: '89 subscribers showing early churn indicators. Immediate action recommended.',
          timestamp: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: false,
          priority: 'high',
          actionUrl: '/admin/analytics',
          actionText: 'View Analytics'
        },
        {
          id: '2',
          type: 'info',
          category: 'revenue',
          title: 'Monthly Revenue Target Achieved',
          message: 'Congratulations! This month\'s revenue target of ₹25L has been exceeded by 8%.',
          timestamp: new Date(now - 6 * 60 * 60 * 1000), // 6 hours ago
          isRead: false,
          priority: 'medium',
          actionUrl: '/admin/analytics',
          actionText: 'View Report'
        },
        {
          id: '3',
          type: 'warning',
          category: 'system',
          title: 'Network Maintenance Scheduled',
          message: 'Scheduled maintenance on Sunday 2-4 AM. Notify affected customers.',
          timestamp: new Date(now - 12 * 60 * 60 * 1000), // 12 hours ago
          isRead: true,
          priority: 'medium',
          actionUrl: '/admin/plans',
          actionText: 'Manage Plans'
        },
        {
          id: '4',
          type: 'success',
          category: 'marketing',
          title: 'New Discount Campaign Success',
          message: 'WELCOME25 campaign achieved 23.4% conversion rate with 234 new subscriptions.',
          timestamp: new Date(now - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: true,
          priority: 'low',
          actionUrl: '/admin/discounts',
          actionText: 'View Discounts'
        }
      );
    } else {
      // End-user notifications
      baseNotifications.push(
        {
          id: '5',
          type: 'info',
          category: 'billing',
          title: 'Bill Generated',
          message: 'Your monthly bill of ₹999 has been generated. Due date: Dec 25, 2024.',
          timestamp: new Date(now - 3 * 60 * 60 * 1000), // 3 hours ago
          isRead: false,
          priority: 'medium',
          actionUrl: '/subscriptions',
          actionText: 'View Bill'
        },
        {
          id: '6',
          type: 'warning',
          category: 'usage',
          title: 'High Usage Alert',
          message: 'You\'ve used 85% of your monthly data quota. Consider upgrading your plan.',
          timestamp: new Date(now - 8 * 60 * 60 * 1000), // 8 hours ago
          isRead: false,
          priority: 'medium',
          actionUrl: '/usage',
          actionText: 'View Usage'
        },
        {
          id: '7',
          type: 'success',
          category: 'service',
          title: 'Speed Upgrade Complete',
          message: 'Your connection speed has been upgraded to 100 Mbps. Enjoy faster internet!',
          timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isRead: true,
          priority: 'low',
          actionUrl: '/usage',
          actionText: 'Test Speed'
        },
        {
          id: '8',
          type: 'info',
          category: 'promotional',
          title: 'Special Offer Available',
          message: 'Upgrade to Fibernet Ultra and save 20% for the first 3 months!',
          timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isRead: true,
          priority: 'low',
          actionUrl: '/subscriptions',
          actionText: 'View Offers'
        }
      );
    }

    return baseNotifications.sort((a, b) => b.timestamp - a.timestamp);
  };

  const markAsRead = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return 'bi-exclamation-triangle text-danger';
      case 'warning': return 'bi-exclamation-circle text-warning';
      case 'success': return 'bi-check-circle text-success';
      case 'info': return 'bi-info-circle text-info';
      default: return 'bi-bell text-primary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'badge bg-danger';
      case 'medium': return 'badge bg-warning';
      case 'low': return 'badge bg-secondary';
      default: return 'badge bg-primary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.category === filter);

  const categories = ['all', 'unread', ...new Set(notifications.map(n => n.category))];

  return (
    <>
      {/* Notification Bell */}
      <div className="notification-bell" onClick={() => setShowPanel(!showPanel)}>
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </div>

      {/* Notification Panel */}
      {showPanel && (
        <div className="notification-panel">
          <div className="notification-header">
            <h5 className="notification-title">
              <i className="bi bi-bell me-2"></i>
              Notifications
            </h5>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </button>
              )}
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowPanel(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>

          <div className="notification-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category === 'unread' && unreadCount > 0 && (
                  <span className="filter-count">({unreadCount})</span>
                )}
              </button>
            ))}
          </div>

          <div className="notification-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-meta">
                      <span className={getPriorityBadge(notification.priority)}>
                        {notification.priority}
                      </span>
                      <span className="notification-time">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <h6 className="notification-item-title">{notification.title}</h6>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-item-actions">
                      {notification.actionUrl && (
                        <a 
                          href={notification.actionUrl} 
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPanel(false);
                          }}
                        >
                          {notification.actionText}
                        </a>
                      )}
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <i className="bi bi-bell-slash"></i>
                <p>No notifications found</p>
              </div>
            )}
          </div>

          {filteredNotifications.length > 5 && (
            <div className="notification-footer">
              <button className="btn btn-sm btn-outline-primary w-100">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {showPanel && (
        <div 
          className="notification-overlay"
          onClick={() => setShowPanel(false)}
        ></div>
      )}
    </>
  );
};

export default NotificationSystem;
