import useGetNotificationData from '@hooks/useGetNotificationData';
import React, { useState } from 'react';
import { CiLock } from 'react-icons/ci';
import { FaBell, FaFileAlt, FaPills } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetNotificationData(page);
  const notifications = data?.notifications || [];

  /* ---------------- utils ---------------- */

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
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

  /* ---------------- styles ---------------- */

  const getNotificationStyle = (actionType, isRead) => {
    const base =
      'relative rounded-xl p-3 cursor-pointer transition-all duration-200';

    const unread =
      'bg-white border border-blue-200 ring-1 ring-blue-300 shadow-md hover:shadow-xl hover:scale-[1.02]';

    const read = 'bg-gray-50 border border-gray-200 hover:shadow-md';

    let leftBorder = 'border-l-4 border-l-blue-500';

    if (actionType === 'Approved') {
      leftBorder = 'border-l-4 border-l-green-500';
    } else if (actionType === 'Declined') {
      leftBorder = 'border-l-4 border-l-red-500';
    }

    return `${base} ${leftBorder} ${isRead ? read : unread}`;
  };

  const getIconBgStyle = (actionType) => {
    if (actionType === 'Approved') {
      return 'bg-green-100 text-green-600';
    }
    if (actionType === 'Declined') {
      return 'bg-red-100 text-red-600';
    }
    return 'bg-blue-100 text-blue-600';
  };

  const handleLoadMore = () => setPage((p) => p + 1);

  const hasMoreData = data?.pagination?.hasNextPage;

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen p-4 pb-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-4">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-xs text-gray-600 mt-1">
            {notifications.filter((n) => !n.isRead).length} unread
          </p>
        </div>

        {/* Loading */}
        {isLoading && page === 1 && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
            <p className="text-sm text-gray-600 mt-2">
              Loading notifications...
            </p>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => navigate(notification.actionUrl)}
              className={getNotificationStyle(
                notification.actionType,
                notification.isRead,
              )}
            >
              {/* unread pulse */}
              {!notification.isRead && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}

              <div className="flex gap-3">
                <div
                  className={`${getIconBgStyle(
                    notification.actionType,
                  )} p-2 rounded-lg flex-shrink-0 ${
                    !notification.isRead ? 'ring-2 ring-blue-300' : ''
                  }`}
                >
                  {getNotificationIcon(notification.notificationType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm leading-tight ${
                        notification.isRead
                          ? 'text-gray-600 font-medium'
                          : 'text-gray-900 font-semibold'
                      }`}
                    >
                      {notification.title}
                    </h4>

                    {!notification.isRead && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                        NEW
                      </span>
                    )}
                  </div>

                  {notification.reviewNote && (
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.reviewNote}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-2">
                    <CiLock className="w-3 h-3 text-gray-400" />
                    <span
                      className={`text-xs ${
                        notification.isRead ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasMoreData && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-2 text-sm font-medium text-gray-700 hover:bg-white/60 disabled:opacity-50"
            >
              {isFetching ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-12 bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl">
            <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-800">
              No notifications
            </h3>
            <p className="text-sm text-gray-500">You’re all caught up 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
