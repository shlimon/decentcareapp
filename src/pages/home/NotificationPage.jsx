import useGetNotificationData from '@hooks/useGetNotificationData';
import React, { useMemo, useState } from 'react';
import { CiLock } from 'react-icons/ci';
import {
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaPills,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('unread'); // 'unread' | 'read'

  const { data, isLoading, isFetching } = useGetNotificationData(page);

  const allNotifications = useMemo(() => data?.notifications || [], [data]);

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage ?? 1;
  const hasNextPage = pagination?.hasNextPage ?? false;
  const hasPrevPage = page > 1;

  /* ---------------- filtering ---------------- */
  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.isRead).length,
    [allNotifications],
  );
  const readCount = useMemo(
    () => allNotifications.filter((n) => n.isRead).length,
    [allNotifications],
  );
  const visibleNotifications = useMemo(
    () =>
      allNotifications.filter((n) =>
        activeTab === 'unread' ? !n.isRead : n.isRead,
      ),
    [allNotifications, activeTab],
  );

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

  const handleNotificationClick = (notification) => {
    const separator = notification.actionUrl.includes('?') ? '&' : '?';
    navigate(
      `${notification.actionUrl}${separator}notificationId=${notification._id}&isRead=${notification.isRead}`,
    );
  };

  /* ---------------- render ---------------- */
  return (
    <div className="min-h-screen p-4 pb-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Page {page} {totalPages > 1 ? `of ${totalPages}` : ''}
            </p>
          </div>
          <div className="relative">
            <FaBell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'unread'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'unread'
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'read'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Read
            {readCount > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'read'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {readCount}
              </span>
            )}
          </button>
        </div>

        {/* Loading overlay */}
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-6">
            <div className="inline-block animate-spin h-7 w-7 border-2 border-blue-500 border-b-transparent rounded-full" />
          </div>
        )}

        {/* Notification list */}
        {!isLoading && !isFetching && (
          <div className="space-y-3">
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={getNotificationStyle(notification.isRead)}
                >
                  {!notification.isRead && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}

                  <div className="flex gap-3">
                    <div
                      className={`p-2 rounded-lg flex shrink-0 ${
                        notification.isRead
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-100 text-blue-600 ring-2 ring-blue-300'
                      }`}
                    >
                      {getNotificationIcon(notification.notificationType)}
                    </div>

                    <div className="flex-1 min-w-0">
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
                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                          {notification.actionText}
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 mt-2">
                        <CiLock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <FaBell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-500">
                  No {activeTab} notifications
                </h3>
              </div>
            )}
          </div>
        )}

        {/* Pagination controls */}
        {(hasPrevPage || hasNextPage) && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevPage || isFetching}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft className="w-3 h-3" />
              Previous
            </button>

            <span className="text-xs text-gray-400 tabular-nums">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage || isFetching}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
