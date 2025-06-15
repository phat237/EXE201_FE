import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message, read: false },
      ...prev,
    ]);
    setUnreadCount((count) => count + 1);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, unreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
} 