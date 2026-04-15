import Loading from '@components/reusable/loading/Loading';
import useGetMyAnnouncements from '@hooks/useGetMyAnnouncements';
import { Bell } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Announcement = () => {
  const { data, isLoading, error } = useGetMyAnnouncements();
  const navigate = useNavigate();
  const [showRead, setShowRead] = useState(false);

  const unreadAnnouncements = useMemo(() => {
    return data?.filter((item) => item.isRead === false) || [];
  }, [data]);

  const readAnnouncements = useMemo(() => {
    return data?.filter((item) => item.isRead === true) || [];
  }, [data]);

  const announcementsToShow = showRead
    ? readAnnouncements
    : unreadAnnouncements;

  if (isLoading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">Failed to load</div>;

  return (
    <main className="relative min-h-screen">
      {/* DO NOT TOUCH h3 */}
      <h3>Announcements</h3>

      {/* Floating Bell Button */}
      <button
        onClick={() => setShowRead((prev) => !prev)}
        className="absolute -top-4 right-2 bg-white shadow-md border border-gray-200 rounded-full p-2 transition hover:shadow-lg"
      >
        <div className="relative">
          <Bell
            className={`w-5 h-5 ${
              showRead ? 'text-gray-400' : 'text-blue-600'
            }`}
          />

          {unreadAnnouncements.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {unreadAnnouncements.length}
            </span>
          )}
        </div>
      </button>

      {/* Spacing below title */}
      <div className="space-y-4 px-2.5 pb-8">
        {announcementsToShow.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-16">
            {showRead ? 'No read announcements' : 'No unread announcements 🎉'}
          </div>
        ) : (
          announcementsToShow.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/announcements/${item._id}`)}
              className={`
                bg-white
                border
                rounded-lg
                p-4
                shadow-sm
                transition
                active:scale-[0.98]
                cursor-pointer
                hover:shadow-md
                ${
                  !item.isRead
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 line-clamp-1">
                  {item.title}
                </h4>

                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div
                className="text-sm text-gray-600 line-clamp-2 mb-1"
                dangerouslySetInnerHTML={{
                  __html: item.message,
                }}
              />
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default React.memo(Announcement);
