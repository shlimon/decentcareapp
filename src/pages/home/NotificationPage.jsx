import React, { useState } from 'react';
import { CiLock } from 'react-icons/ci';
import { FaBell, FaFileAlt, FaPills } from 'react-icons/fa';

const NotificationPage = () => {
   const [notifications] = useState([
      {
         title: 'Your medication request is approved',
         actionType: 'Accept',
         actionText: 'View Approval',
         isRead: false,
         notificationType: 'MEDICATION',
         actionUrl: '/medication/approve/692bc9f92fe21a5349fd1c27',
         status: 'Active',
         item: { $oid: '692bc9f92fe21a5349fd1c27' },
         recipient: { $oid: '6923f56ac77b02c69c984810' },
         createdAt: { $date: '2025-11-30T06:18:00.854Z' },
         updatedAt: { $date: '2025-11-30T06:18:00.854Z' },
      },
      {
         title: 'Your medication request was declined',
         actionType: 'Decline',
         actionText: 'View Reason',
         isRead: false,
         notificationType: 'MEDICATION',
         actionUrl: '/medication/decline/692bc9f92fe21a5349fd1c27',
         status: 'Active',
         item: { $oid: '692bc9f92fe21a5349fd1c27' },
         recipient: { $oid: '6923f56ac77b02c69c984810' },
         createdAt: { $date: '2025-11-30T06:19:00.854Z' },
         updatedAt: { $date: '2025-11-30T06:19:00.854Z' },
      },
      {
         title: 'Medication request automatically deactivated',
         actionType: 'Decline',
         actionText: 'Review Request',
         isRead: false,
         notificationType: 'MEDICATION',
         actionUrl: '/medication/deactivated/692bc9f92fe21a5349fd1c27',
         status: 'DeActive',
         item: { $oid: '692bc9f92fe21a5349fd1c27' },
         recipient: { $oid: '6923f56ac77b02c69c984810' },
         createdAt: { $date: '2025-11-30T06:20:00.854Z' },
         updatedAt: { $date: '2025-11-30T06:20:00.854Z' },
      },
      {
         title: 'Medication request approved (viewed)',
         actionType: 'Accept',
         actionText: 'View Details',
         isRead: true,
         notificationType: 'MEDICATION',
         actionUrl: '/medication/approved/692bc9f92fe21a5349fd1c27',
         status: 'Active',
         item: { $oid: '692bc9f92fe21a5349fd1c27' },
         recipient: { $oid: '6923f56ac77b02c69c984810' },
         createdAt: { $date: '2025-11-30T06:21:00.854Z' },
         updatedAt: { $date: '2025-11-30T06:21:00.854Z' },
      },
      {
         title: 'Medication request declined (viewed)',
         actionType: 'Decline',
         actionText: 'See Decline Details',
         isRead: true,
         notificationType: 'MEDICATION',
         actionUrl: '/medication/declined/692bc9f92fe21a5349fd1c27',
         status: 'Active',
         item: { $oid: '692bc9f92fe21a5349fd1c27' },
         recipient: { $oid: '6923f56ac77b02c69c984810' },
         createdAt: { $date: '2025-11-30T06:22:00.854Z' },
         updatedAt: { $date: '2025-11-30T06:22:00.854Z' },
      },
   ]);

   // Filter only Active notifications
   const activeNotifications = notifications.filter(
      (n) => n.status === 'Active'
   );

   const getTimeAgo = (dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
   };

   const getNotificationIcon = (type) => {
      switch (type) {
         case 'MEDICATION':
            return <FaPills className="w-5 h-5" />;
         case 'TASK':
            return <FaFileAlt className="w-5 h-5" />;
         default:
            return <FaBell className="w-5 h-5" />;
      }
   };

   const getNotificationStyle = (actionType, isRead) => {
      const baseStyle =
         'border-l-4 transition-all duration-200 hover:shadow-md';

      if (actionType === 'Accept') {
         return `${baseStyle} ${
            isRead
               ? 'bg-green-50 border-green-500'
               : 'bg-green-100 border-green-500'
         }`;
      } else {
         return `${baseStyle} ${
            isRead ? 'bg-red-50 border-red-500' : 'bg-red-100 border-red-500'
         }`;
      }
   };

   const getIconBgStyle = (actionType) => {
      return actionType === 'Accept'
         ? 'bg-green-100 text-green-600'
         : 'bg-red-100 text-red-600';
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-3xl mx-auto">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900">
                  Notifications
               </h1>
               <p className="text-gray-500 mt-2">
                  You have {activeNotifications.filter((n) => !n.isRead).length}{' '}
                  unread notifications
               </p>
            </div>

            <div className="space-y-3">
               {activeNotifications.map((notification, index) => (
                  <div
                     key={index}
                     className={`${getNotificationStyle(
                        notification.actionType,
                        notification.isRead
                     )} rounded-lg p-4 cursor-pointer`}
                  >
                     <div className="flex items-start gap-4">
                        <div
                           className={`${getIconBgStyle(
                              notification.actionType
                           )} p-3 rounded-lg flex-shrink-0`}
                        >
                           {getNotificationIcon(notification.notificationType)}
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex-1">
                              <div className="flex items-center gap-2">
                                 <h3
                                    className={`font-semibold text-gray-900 ${
                                       !notification.isRead ? 'font-bold' : ''
                                    }`}
                                 >
                                    {notification.title}
                                 </h3>
                                 {!notification.isRead && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                 )}
                              </div>

                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                 <CiLock className="w-4 h-4" />
                                 <span>
                                    {getTimeAgo(notification.createdAt.$date)}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {activeNotifications.length === 0 && (
               <div className="text-center py-12">
                  <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                     No notifications
                  </h3>
                  <p className="text-gray-500">You're all caught up!</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default NotificationPage;
