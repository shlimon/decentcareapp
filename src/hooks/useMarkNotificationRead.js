import axiosInstance from "@api/axiosInstance";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useMarkNotificationRead = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const notificationId = params.get("notificationId");
        const isRead = params.get("isRead");

        if (!notificationId || isRead !== "false") return;

        const sessionKey = `notification-read-${notificationId}`;

        if (sessionStorage.getItem(sessionKey)) return;

        sessionStorage.setItem(sessionKey, "true");

        axiosInstance
            .patch(`/notifications/${notificationId}/read`)
            .catch((error) => {
                console.error("Failed to mark notification as read", error);
                sessionStorage.removeItem(sessionKey);
            });
    }, [location.search]);
};

export default useMarkNotificationRead;
