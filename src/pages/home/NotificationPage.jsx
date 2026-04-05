import useGetNotificationData from '@hooks/useGetNotificationData';
import React, { useMemo, useState } from 'react';
import { CiLock } from 'react-icons/ci';
import { FaBell, FaFileAlt, FaPills } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showRead, setShowRead] = useState(false); // 👈 false = unread, true = read

  const { data, isLoading, isFetching } = useGetNotificationData(page);

  const allNotifications = data?.notifications || [];

  /* ---------------- filtering logic ---------------- */
  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.isRead).length,
    [allNotifications],
  );

  const readCount = useMemo(
    () => allNotifications.filter((n) => n.isRead).length,
    [allNotifications],
  );

  const visibleNotifications = useMemo(() => {
    return showRead
      ? allNotifications.filter((n) => n.isRead) // 👈 only read
      : allNotifications.filter((n) => !n.isRead); // 👈 only unread
  }, [allNotifications, showRead]);

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

  const getNotificationStyle = (isRead) => {
    const base =
      'relative rounded-xl p-3 cursor-pointer transition-all duration-200';

    const unread =
      'bg-white border border-blue-200 ring-1 ring-blue-300 shadow-md hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-blue-500';

    const read =
      'bg-gray-50 border border-gray-200 hover:shadow-md border-l-4 border-l-gray-300';

    return `${base} ${isRead ? read : unread}`;
  };

  const handleLoadMore = () => setPage((p) => p + 1);
  const hasMoreData = data?.pagination?.hasNextPage;

  /* ---------------- render ---------------- */
  return (
    <div className="min-h-screen p-4 pb-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            <p className=" text-gray-600 mt-1">
              {showRead ? `${readCount} read` : `${unreadCount} unread`}
            </p>
          </div>

          {/* Bell Icon (Show Read Only) */}
          <div
            className="relative cursor-pointer"
            onClick={() => setShowRead(true)}
          >
            <FaBell className="w-6 h-6 text-gray-700" />

            {unreadCount > 0 && !showRead && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Toggle Back to Unread */}
        {showRead && (
          <button
            onClick={() => setShowRead(false)}
            className="text-xs text-blue-600 hover:underline"
          >
            Show unread notifications
          </button>
        )}

        {/* Loading */}
        {isLoading && page === 1 && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {visibleNotifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                const separator = notification.actionUrl.includes('?')
                  ? '&'
                  : '?';

                navigate(
                  `${notification.actionUrl}${separator}notificationId=${notification._id}&isRead=${notification.isRead}`,
                );
              }}
              className={getNotificationStyle(notification.isRead)}
            >
              {!notification.isRead && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}

              <div className="flex gap-3">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    notification.isRead
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-blue-100 text-blue-600 ring-2 ring-blue-300'
                  }`}
                >
                  {getNotificationIcon(notification.notificationType)}
                </div>

                <div className="flex-1">
                  <h4
                    className={`text-sm ${
                      notification.isRead
                        ? 'text-gray-600 font-medium'
                        : 'text-gray-900 font-semibold'
                    }`}
                  >
                    {notification.title}
                  </h4>

                  {notification.actionText && (
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.actionText}
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

        {/* Load More */}
        {hasMoreData && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="bg-white border rounded-full px-6 py-2 text-sm"
            >
              {isFetching ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && visibleNotifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-800">
              No {showRead ? 'read' : 'unread'} notifications
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
