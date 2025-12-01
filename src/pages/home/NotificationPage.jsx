import useGetNotificationData from '@hooks/useGetNotificationData';
import React, { useEffect, useState } from 'react';
import { CiLock } from 'react-icons/ci';
import { FaBell, FaFileAlt, FaPills } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetNotificationData(page);

  // Accumulate notifications across pages
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    if (data) {
      setAllNotifications((prev) => {
        const newNotifications = Array.isArray(data) ? data : [];
        const existingIds = new Set(prev.map((n) => n._id));
        const uniqueNew = newNotifications.filter(
          (n) => !existingIds.has(n._id)
        );
        return [...prev, ...uniqueNew];
      });
    }
  }, [data]);

  // Filter only Active notifications
  const activeNotifications = allNotifications.filter(
    (n) => n.status === 'Active'
  );

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'MEDICATION':
        return <FaPills className="w-4 h-4" />;
      case 'TASK':
        return <FaFileAlt className="w-4 h-4" />;
      default:
        return <FaBell className="w-4 h-4" />;
    }
  };

  const getNotificationStyle = (actionType, isRead) => {
    const baseStyle = 'backdrop-blur-md border border-white/20 shadow-lg';

    if (actionType === 'Approved') {
      return `${baseStyle} ${
        isRead
          ? 'border-l-4 border-l-green-400 bg-green-50'
          : 'border-l-4 border-l-green-500 bg-green-50'
      }`;
    } else if (actionType === 'Declined') {
      return `${baseStyle} ${
        isRead
          ? 'border-l-4 border-l-red-400 bg-red-50'
          : 'border-l-4 border-l-red-500 bg-red-50'
      }`;
    } else {
      return `${baseStyle} ${
        isRead
          ? 'border-l-4 border-l-blue-400'
          : 'border-l-4 border-l-blue-500 bg-white/50'
      }`;
    }
  };

  const getIconBgStyle = (actionType) => {
    if (actionType === 'Approved') {
      return 'bg-green-100/80 text-green-600';
    } else if (actionType === 'Declined') {
      return 'bg-red-100/80 text-red-600';
    } else {
      return 'bg-blue-100/80 text-blue-600';
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const hasMoreData = Array.isArray(data) && data.length === 10;

  return (
    <div className="min-h-screen p-4 pb-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 backdrop-blur-md bg-white/40 border border-white/20 shadow-lg rounded-2xl p-4">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-xs text-gray-600 mt-1">
            {activeNotifications.filter((n) => !n.isRead).length} notification
            {activeNotifications.filter((n) => !n.isRead).length !== 1
              ? 's'
              : ''}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && page === 1 && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600 mt-2">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {activeNotifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => navigate(`${notification.actionUrl}`)}
              className={`${getNotificationStyle(
                notification.actionType,
                notification.isRead
              )} rounded-xl p-2 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`${getIconBgStyle(
                    notification.actionType
                  )} p-2 rounded-lg flex-shrink-0`}
                >
                  {getNotificationIcon(notification.notificationType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-sm text-gray-800 leading-tight ${
                        !notification.isRead ? 'font-semibold' : 'font-medium'
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                    )}
                  </div>

                  {notification.reviewNote && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {notification.reviewNote}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-2">
                    <CiLock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreData && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="backdrop-blur-md bg-white/40 border border-white/20 shadow-lg rounded-full px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl active:scale-95"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {activeNotifications.length === 0 && !isLoading && (
          <div className="text-center py-12 backdrop-blur-md bg-white/40 border border-white/20 shadow-lg rounded-2xl">
            <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-800 mb-1">
              No notifications
            </h3>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
