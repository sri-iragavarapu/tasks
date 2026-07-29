import { useState } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState("");

  const showNotification = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  return { notification, showNotification };
};