import Loading from '@components/reusable/loading/Loading';
import useGetMyAnnouncements from '@hooks/useGetMyAnnouncements';
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const Announcement = () => {
  const { data, isLoading, error } = useGetMyAnnouncements();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unread'); // 'unread' | 'read'
  const [page, setPage] = useState(1);

  /* ---------------- derived data ---------------- */
  const allAnnouncements = data || [];

  const unreadList = useMemo(
    () => allAnnouncements.filter((item) => item.isRead === false),
    [allAnnouncements],
  );
  const readList = useMemo(
    () => allAnnouncements.filter((item) => item.isRead === true),
    [allAnnouncements],
  );

  const activeList = activeTab === 'unread' ? unreadList : readList;
  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const paginatedList = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return activeList.slice(start, start + PAGE_SIZE);
  }, [activeList, page]);

  /* ---------------- utils ---------------- */
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAudienceIcon = (audience = []) => {
    if (audience.includes('Company')) return <Building2 className="w-3 h-3" />;
    return <Users className="w-3 h-3" />;
  };

  /* ---------------- early returns ---------------- */
  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="p-4 text-red-500">Failed to load announcements.</div>
    );

  /* ---------------- render ---------------- */
  return (
    <main className="relative min-h-screen">
      {/* DO NOT TOUCH h3 */}
      <h3>Announcements</h3>

      <div className="space-y-4 px-2.5 pb-8 mt-2">
        {/* Tabs */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
          <button
            onClick={() => handleTabChange('unread')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'unread'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Unread
            {unreadList.length > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'unread'
                    ? 'bg-white/25 text-white'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {unreadList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('read')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'read'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Read
            {readList.length > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'read'
                    ? 'bg-white/25 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {readList.length}
              </span>
            )}
          </button>
        </div>

        {/* List */}
        {paginatedList.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-16">
            {activeTab === 'read'
              ? 'No read announcements'
              : 'No unread announcements 🎉'}
          </div>
        ) : (
          paginatedList.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/announcements/${item._id}`)}
              className={`
                bg-white border rounded-lg p-4 shadow-sm transition
                active:scale-[0.98] cursor-pointer hover:shadow-md
                ${!item.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}
              `}
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-1.5 gap-2">
                <h4 className="font-medium text-gray-800 line-clamp-1 flex-1">
                  {item.title}
                </h4>
                {!item.isRead && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                )}
              </div>

              {/* Message preview */}
              <div
                className="text-sm text-gray-600 line-clamp-2 mb-2"
                dangerouslySetInnerHTML={{ __html: item.message }}
              />

              {/* Footer meta */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  {getAudienceIcon(item.audience)}
                  <span>{item.audience?.join(', ')}</span>
                  <span className="text-gray-300">·</span>
                  <span>{item.createdBy?.name}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Pagination — only renders when there's more than 1 page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded-lg font-medium transition-colors ${
                    p === page
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default React.memo(Announcement);
